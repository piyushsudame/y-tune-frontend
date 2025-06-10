import mongoose from 'mongoose';
const { Schema, model } = mongoose
console.log("Schema made successfully");

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    resetToken: String,
    resetTokenExpiry: Date
})

export default mongoose.models.User || model("User", userSchema); 