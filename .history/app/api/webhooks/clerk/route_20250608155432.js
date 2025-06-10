// app/api/webhooks/clerk/route.js
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { connectToDatabase } from "@/lib/mongoose"
import User from "@/lib/user"

export async function POST(req) {
  // Get the headers
  const headerPayload = await headers()
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
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

  let evt

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    return new Response('Error occured', {
      status: 400
    })
  }

  // Handle the webhook
  const { id } = evt.data
  const eventType = evt.type

  try {
    await connectToDatabase()

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id: clerkId, email_addresses, first_name, last_name } = evt.data
      const email = email_addresses[0]?.email_address || ""
      const name = `${first_name || ""} ${last_name || ""}`.trim()
      
      // Check if user already exists
      const existingUser = await User.findOne({ clerkId })
      
      if (!existingUser && eventType === 'user.created') {
        await User.create({
          name,
          email,
          clerkId,
          isSpotifyConnected: false
        })
      } else if (existingUser && eventType === 'user.updated') {
        await User.findOneAndUpdate(
          { clerkId },
          { name, email },
          { new: true }
        )
      }
    } else if (eventType === 'user.deleted') {
      const { id: clerkId } = evt.data
      await User.findOneAndDelete({ clerkId })
    }
  } catch (error) {
    return new Response('Database error', { status: 500 })
  }

  return new Response('', { status: 200 })
}