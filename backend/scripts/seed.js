import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../src/models/Admin.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD env vars before running seed.");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const exists = await Admin.findOne({ email: email.toLowerCase() });
if (exists) {
  console.log(`Admin ${email} already exists. Skipping.`);
  await mongoose.disconnect();
  process.exit(0);
}

const passwordHash = await bcrypt.hash(password, 12);
await Admin.create({ email: email.toLowerCase(), passwordHash });

console.log(`Admin ${email} created.`);
await mongoose.disconnect();
