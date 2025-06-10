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
    }
    spotifyId: {
        type: String,
        required: true,
        index: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})
console.log("Schema made with values:", userSchema.obj);

export default mongoose.models.User || model("User", userSchema); 
console.log("User Model created successfully")