// app/api/webhooks/clerk/route.js
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { connectToDatabase } from "@/lib/mongoose"
import User from "@/lib/user"
import { createClerkClient } from '@clerk/backend'
import { create } from 'domain'

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
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET)

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
  } else if (eventType === 'session.created') {
    // Handle session creation - sync user if not exists
    const { user_id: clerkId } = evt.data
    console.log('Session created for user:', clerkId)
    
    // Check if user exists in our database
    const existingUser = await User.findOne({ clerkId })
    
    if (!existingUser) {
      console.log('User not found in database, fetching from Clerk API')
      // We need to fetch user details from Clerk API since session event doesn't include user profile
      try {
        // const { clerkClient } = await import('@clerk/nextjs/server')
        const clerk = createClerkClient({
          secretKey: process.env.CLERK_WEBHOOK_SIGNING_SECRET
        })
        const user = await clerk.users.getUser(clerkId)
        
        const email = user.emailAddresses[0]?.emailAddress || ""
        const name = `${user.firstName || ""} ${user.lastName || ""}`.trim()
        
        await User.create({
          name,
          email,
          clerkId,
          isSpotifyConnected: false
        })
        console.log('User created from session event:', clerkId)
      } catch (clerkError) {
        console.log('Failed to fetch user from Clerk:', clerkError)
      }
    }
  }

  return new Response('', { status: 200 })
}