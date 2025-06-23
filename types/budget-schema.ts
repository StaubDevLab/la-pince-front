import z from "zod";

export const budgetSchema = z.object({
  categoryId: z.string().uuid("Le choix d'une catégorie est requis"),
  totalAmount: z.number().min(1, "Le montant doit être suppérieur à 0"),
  recurringFrequency: z.string().min(1,"Le choix de la fréquence est requis"),
  recurringStartDate: z.string().date("La date est invalide")
});