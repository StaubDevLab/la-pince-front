import { object, string } from "zod"

export const loginSchema = object({
    email: string({ required_error: "L'email est requis" })
        .min(1, "L'email est requis")
        .email("L'email n'est pas valide"),
    password: string({ required_error: "Mot de passe requis" })
        .min(1, "Mot de passe requis")
        .min(12, "Le mot de passe doit avoir au moins 12 caractères")
        .max(32, "Le mot de passe doit avoir au plus 32 caractères"),
})
