import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/lib/user";

export async function GET() {
    const user = await currentUser();

    if (!user) {
        return new Response(JSON.stringify({ error: 'User not authenticated'}, { status: 401}))

        const { id: clerkId, }
    }
}