import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  passwordHash: {
    type: String,
    required: [true, "Password is required"],
  },
});

adminSchema.set("timestamps", true);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
