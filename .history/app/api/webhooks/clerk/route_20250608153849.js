// app/api/webhooks/clerk/route.js
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { connectToDatabase } from "@/lib/mongoose"
import User from "@/lib/user"

export async function POST(req) {
  console.log('Webhook endpoint hit - starting execution')
  
  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  console.log('Received headers:', { svix_id, svix_timestamp, svix_signature })

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log('Missing required headers')
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)
  console.log('Received payload:', payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
  console.log('Webhook secret exists:', !!process.env.WEBHOOK_SECRET)

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
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const { id } = evt.data
  const eventType = evt.type

  console.log(`Processing webhook - ID: ${id}, Type: ${eventType}`)
  console.log('Webhook body:', body)

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id: clerkId, email_addresses, first_name, last_name } = evt.data
    const email = email_addresses[0]?.email_address || ""
    const name = `${first_name || ""} ${last_name || ""}`.trim()

    console.log('Processing user data:', { clerkId, email, name })

    try {
      console.log('Attempting database connection')
      await connectToDatabase()
      console.log('Database connection successful')
      
      // Check if user already exists
      const existingUser = await User.findOne({ clerkId })
      console.log('Existing user check:', !!existingUser)
      
      if (!existingUser && eventType === 'user.created') {
        console.log('Creating new user in database')
        await User.create({
          name,
          email,
          clerkId,
          isSpotifyConnected: false
        })
        console.log('New user created in database:', clerkId)
      } else if (existingUser && eventType === 'user.updated') {
        console.log('Updating existing user in database')
        await User.findOneAndUpdate(
          { clerkId },
          { name, email },
          { new: true }
        )
        console.log('User updated in database:', clerkId)
      }
    } catch (error) {
      console.error('Database error:', error)
      return new Response('Database error', { status: 500 })
    }
  }

  console.log('Webhook processing completed successfully')
  return new Response('', { status: 200 })
}