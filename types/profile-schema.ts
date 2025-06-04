import { z } from "zod"
export const profileSchema = z.object({
  firstName: z.string().min(2, "Nom requis"),
lastName: z.string().min(2, "Prénom requis"),
  email: z.string().email("Email invalide"),
  accountName: z.string().min(2, "Nom de compte requis"),
  
})