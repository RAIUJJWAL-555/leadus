import { Router } from "express";
import { createLead, listLeads, updateStatus } from "../controllers/leadController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.post("/", createLead);
router.get("/", auth, listLeads);
router.patch("/:id/status", auth, updateStatus);

export default router;
