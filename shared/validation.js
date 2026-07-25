import { z } from "zod";

export const budgetRanges = ["under_1k", "1k_5k", "5k_20k", "20k_plus"];

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less"),
  email: z.string().trim().email("Please enter a valid email address"),
  budget: z.enum(budgetRanges, {
    errorMap: () => ({ message: "Please select a budget range" }),
  }),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be 2000 characters or less"),
});

export const statusEnum = ["New", "Contacted", "Closed"];
