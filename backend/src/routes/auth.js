import { Router } from "express";
import { login, me } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import rateLimiter from "../middleware/rateLimiter.js";

const router = Router();

router.post("/login", rateLimiter(5, 15 * 60 * 1000), login);
router.get("/me", auth, me);

export default router;
