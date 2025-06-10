// app/api/webhooks/clerk/route.js
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { connectToDatabase } from "@/lib/mongoose"
import User from "@/lib/user"

export async function POST(req) {
  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.WEBHOOK_SECRET)

  let evt

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const { id } = evt.data
  const eventType = evt.type

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id: clerkId, email_addresses, first_name, last_name } = evt.data
    const email = email_addresses[0]?.email_address || ""
    const name = `${first_name || ""} ${last_name || ""}`.trim()

    try {
      await connectToDatabase()
      
      // Check if user already exists
      const existingUser = await User.findOne({ clerkId })
      
      if (!existingUser && eventType === 'user.created') {
        await User.create({
          name,
          email,
          clerkId,
          isSpotifyConnected: false
        })
        console.log('New user created in database:', clerkId)
      } else if (existingUser && eventType === 'user.updated') {
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

  return new Response('', { status: 200 })
}