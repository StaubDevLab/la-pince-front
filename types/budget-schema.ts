import z from "zod";

export const budgetSchema = z.object({
  categoryId: z.string().uuid("Le choix d'une catégorie est requis"),
  totalAmount: z.number().min(1, "Le montant doit être suppérieur à 0"),
  recurringFrequency: z.enum(["weekly", "biweekly", "monthly", "quarterly", "yearly"]),
  recurringStartDate: z.string().date("La date est invalide")
});