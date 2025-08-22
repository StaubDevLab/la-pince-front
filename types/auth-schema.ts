import { object, string, z } from "zod"

export const loginSchema = object({
    email: string({ required_error: "L'email est requis" })
        .min(1, "L'email est requis")
        .email("L'email n'est pas valide"),
    password: string({ required_error: "Mot de passe requis" })
        .min(1, "Mot de passe requis")
        .min(12, "Le mot de passe doit avoir au moins 12 caractères")
        .max(32, "Le mot de passe doit avoir au plus 32 caractères"),
})

export const registerSchema = object({
    firstName: string({ required_error: "Prénom requis" })
        .min(1, "Prénom requis")
        .max(50, "Le prénom doit avoir au plus 50 caractères"),
    lastName: string({ required_error: "Nom requis" })
        .min(1, "Nom requis")
        .max(50, "Le nom doit avoir au plus 50 caractères"),
    email: string({ required_error: "L'email est requis" })
        .min(1, "L'email est requis")
        .email("L'email n'est pas valide"),
    password: string({ required_error: "Mot de passe requis" })
        .min(1, "Mot de passe requis")
        .min(12, "Le mot de passe doit avoir au moins 12 caractères")
        .max(32, "Le mot de passe doit avoir au plus 32 caractères")
        .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
        .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    confirmPassword: string({ required_error: "Confirmation du mot de passe requise" })
        .min(1, "Confirmation du mot de passe requise")
        .min(12, "Le mot de passe doit avoir au moins 12 caractères")
        .max(32, "Le mot de passe doit avoir au plus 32 caractères"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})

export const resetPasswordSchema = object({
    newPassword: string({ required_error: "Mot de passe requis" })
        .min(1, "Mot de passe requis")
        .min(12, "Le mot de passe doit avoir au moins 12 caractères")
        .max(32, "Le mot de passe doit avoir au plus 32 caractères"),
    confirmNewPassword: string({ required_error: "Confirmation du mot de passe requise" })
        .min(1, "Confirmation du mot de passe requise")
        .min(12, "Le mot de passe doit avoir au moins 12 caractères")
        .max(32, "Le mot de passe doit avoir au plus 32 caractères")
})

export const forgotPasswordSchema = object({
    email: string({ required_error: "L'email est requis" })
        .min(1, "L'email est requis")
        .email("L'email n'est pas valide"),
})

export type RegisterFormData = z.infer<typeof registerSchema>