import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import authRoutes from "../backend/src/routes/auth.js";
import leadRoutes from "../backend/src/routes/leads.js";

let cached = null;

async function connectDB() {
  if (cached) return cached;
  cached = await mongoose.connect(process.env.MONGODB_URI);
  return cached;
}

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/leads", leadRoutes);
app.get("/health", (_, res) => res.json({ status: "ok" }));

app.all("/{*splat}", async (req, res) => {
  await connectDB();
  res.json({ status: "ok", message: "LeadDesk Mini API" });
});

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
