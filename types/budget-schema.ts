import z from "zod";

export const budgetSchema = z.object({
  categoryId: z.string().uuid(),
  totalAmount: z.number(),
  reccuringFrequency: z.string(),
  reccuringStartDate: z.string().date()
});