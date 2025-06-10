import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/lib/user";

export async function GET() {
    const user = await currentUser();

    if (!user {
        
    })
}