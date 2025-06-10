import mongoose from 'mongoose';
const { Schema, model } = mongoose

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
console.log("Schema made with values:", userSchema.obj);

export default mongoose.models.User || model("User", userSchema); 
console.log()