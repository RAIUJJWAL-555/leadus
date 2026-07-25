import { leadSchema, statusEnum } from "../shared/validation.js";
import Lead from "../models/Lead.js";

export async function createLead(req, res) {
  const result = leadSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).json({ error: "Validation failed", errors });
  }

  const lead = await Lead.create(result.data);
  res.status(201).json({ message: "Lead submitted successfully", id: lead._id });
}

export async function listLeads(req, res) {
  const { search, status, page = 1 } = req.query;
  const limit = 20;
  const skip = (Math.max(1, Number(page)) - 1) * limit;

  const filter = {};

  if (status && statusEnum.includes(status)) {
    filter.status = status;
  }

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Lead.countDocuments(filter),
  ]);

  res.json({
    leads,
    total,
    page: Math.max(1, Number(page)),
    totalPages: Math.ceil(total / limit),
  });
}

export async function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!statusEnum.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });
  if (!lead) {
    return res.status(404).json({ error: "Lead not found" });
  }

  res.json({ lead });
}
