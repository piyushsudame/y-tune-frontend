import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/lib/user";

export async function GET() {
    const user = await currentUser();

    if (!user) {
        return new Response(JSON.stringify({ error: 'User not authenticated'}, { status: 401}))

        const { id: clerkId, emailAddresses, firstName, lastName } = user;
        const email = emailAddresses[0]?.emailAddress || "";
        const name = `${firstName || ""} ${lastName || ""}`.trim()

        await connectToDatabase();

        const existing = await User.findOne({ clerkId});

        if (!existing) {
            await User.create({
                clerkId,
                name,
                email,
                isSpotifyConnected: false
            })
        }
    }

    return new Response(JSON.stringify(user), {status: 200}
}