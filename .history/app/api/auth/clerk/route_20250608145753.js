import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/lib/user";
import { NextResponse } from "next/server";

console.log("Clerk auth route is being executed");

export async function GET() {
    console.log("GET request received in clerk auth route");
    const user = await currentUser();
    console.log("Current user:", user ? "Found" : "Not found");

    if (!user) {
        console.log("Authentication failed - no user found");
        return new Response(JSON.stringify({ error: 'User not authenticated'}, { status: 401})
    }

    const { id: clerkId, emailAddresses, firstName, lastName } = user;
    const email = emailAddresses[0]?.emailAddress || "";
    const name = `${firstName || ""} ${lastName || ""}`.trim()
    console.log("User details extracted:", { clerkId, email, name });

    await connectToDatabase();
    console.log("Database connection established");

    const existing = await User.findOne({ clerkId});
    console.log("Existing user check:", existing ? "Found" : "Not found");

    if (!existing) {
        console.log("Creating new user in database");
        await User.create({
            name,
            email,
            clerkId,
            isSpotifyConnected: false
        })
        console.log("New user created successfully");
    }

    console.log("Request completed successfully");
    return new Response(JSON.stringify({ success: true }))
}