import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const JWT_EXPIRY = "8h";

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );

  res.json({ token, admin: { id: admin._id, email: admin.email } });
}

export async function me(req, res) {
  const admin = await Admin.findById(req.admin.id).select("-passwordHash");
  if (!admin) {
    return res.status(404).json({ error: "Admin not found" });
  }
  res.json({ admin });
}
