import mongoose from 'mongoose';
const { Schema, model } = mongoose

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    clerkId: {
        type: String,
        required: true,
        index: true
    },
    isSpotifyConnected: Boolean,
    spotifyId: {
        type: String,
        index: true
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    expiresAt: {
        type: Date,
    },
}, {
    timestamps: true
})

export default mongoose.models.User || model("User", userSchema);