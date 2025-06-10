// app/api/webhooks/clerk/route.js
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { connectToDatabase } from "@/lib/mongoose"
import User from "@/lib/user"

export async function POST(req) {
  console.log('Clerk webhook endpoint hit')
  
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  console.log('Webhook headers:', { svix_id, svix_timestamp, svix_signature })

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log('Error: Missing svix headers')
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)
  console.log('Webhook payload:', payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

  let evt

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
    console.log('Webhook verification successful')
  } catch (err) {
    console.log('Webhook verification failed:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const { id } = evt.data
  const eventType = evt.type
  console.log('Processing webhook event:', { eventType, id })

  try {
    await connectToDatabase()
    console.log('Connected to database')

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id: clerkId, email_addresses, first_name, last_name } = evt.data
      const email = email_addresses[0]?.email_address || ""
      const name = `${first_name || ""} ${last_name || ""}`.trim()
      
      console.log('Processing user:', { clerkId, email, name })
      
      // Check if user already exists
      const existingUser = await User.findOne({ clerkId })
      console.log('Existing user check:', existingUser ? 'Found' : 'Not found')
      
      if (!existingUser && eventType === 'user.created') {
        console.log('Creating new user')
        await User.create({
          name,
          email,
          clerkId,
          isSpotifyConnected: false
        })
      } else if (existingUser && eventType === 'user.updated') {
        console.log('Updating existing user')
        await User.findOneAndUpdate(
          { clerkId },
          { name, email },
          { new: true }
        )
      }
    } else if (eventType === 'user.deleted') {
      const { id: clerkId } = evt.data
      console.log('Deleting user:', clerkId)
      await User.findOneAndDelete({ clerkId })
    }
  } catch (error) {
    console.log('Database error:', error)
    return new Response('Database error', { status: 500 })
  }

  console.log('Webhook processing completed successfully')
  return new Response('', { status: 200 })
}