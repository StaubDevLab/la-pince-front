'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '@/types/auth-schema'
import { z } from 'zod'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { EyeOff, Eye } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { resetPasswordAction } from '@/actions/auth.actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import logo from '@/public/la-pince-logo.png'
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
type PasswordRequirements = {
    minLength: boolean
    hasLowercase: boolean
    hasUppercase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
    confirmPassword: boolean
}
export function ResetPasswordForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    })
    const newPassword = watch("newPassword")
    const confirmNewPassword = watch("confirmNewPassword")
   
    const [showPasswords, setShowPasswords] = useState({
            new: false,
            confirm: false,
        })
        const token = useSearchParams().get("token")
        const router = useRouter()
    const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
        minLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        confirmPassword: false
    })
    const validatePassword = (password: string, confirmPassword: string) => {
        setPasswordRequirements({
            minLength: password.length >= 12,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            confirmPassword: password === confirmPassword
        })
       
    }
    useEffect(() => {
        if (newPassword) {
            validatePassword(newPassword, confirmNewPassword)
        } else {
            setPasswordRequirements({
                minLength: false,
                hasLowercase: false,
                hasUppercase: false,
                hasNumber: false,
                hasSpecialChar: false,
                confirmPassword: false
            })
        }
    }, [newPassword, confirmNewPassword])
    const onSubmit = async (data: ResetPasswordFormData) => {
        const payload = {
            newPassword: data.newPassword,
            confirmPassword: data.confirmNewPassword,
            token: token
        }
        if (!token || !payload.newPassword || !payload.confirmPassword) {
            toast.error("Token non trouvé")
            return
        }
        const result = await resetPasswordAction(payload.newPassword, payload.token!, payload.confirmPassword)
        if (result.success) {
            toast.success("Mot de passe modifié avec succès")
            router.push("/app/connexion")
        } else {
            toast.error(result.error || "Une erreur est survenue")
        }
    }
    return (
        <div className="flex flex-col gap-6 items-center">
                   <Image src={logo} alt="logo" height={100} width={75} />
                        <h1 className="text-2xl font-semibold text-center">Réinitialisation de mot de passe</h1>
                        <div className="w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
                <div className="grid gap-2 relative">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type={showPasswords.new ? "text" : "password"} required {...register("newPassword")} aria-label="Nouveau mot de passe"/>
                    {errors.newPassword && (
                        <span className="text-sm text-red-500">
                            {errors.newPassword.message}
                        </span>
                    )}
                    <Button type="button" className="absolute right-3 top-1 translate-y-1/2" variant="ghost" onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })} aria-label="Afficher/masquer le mot de passe">
                        {showPasswords.new ? <EyeOff /> : <Eye />}
                    </Button>
                </div>
                <div className="grid gap-2 relative">
                    <Label htmlFor="confirmNewPassword">Confirmer le nouveau mot de passe</Label>
                    <Input id="confirmNewPassword" type={showPasswords.confirm ? "text" : "password"} required {...register("confirmNewPassword")} aria-label="Confirmer le nouveau mot de passe" />
                    {errors.confirmNewPassword && (
                        <span className="text-sm text-red-500">
                            {errors.confirmNewPassword.message}
                        </span>
                    )}
                    <Button type="button" className="absolute right-3 top-1 translate-y-1/2" variant="ghost" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} aria-label="Afficher/masquer le mot de passe">
                        {showPasswords.confirm ? <EyeOff /> : <Eye />}
                    </Button>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting} aria-label="Changer le mot de passe">
                    {isSubmitting ? 'Changement en cours...' : "Changer le mot de passe"}
                </Button>
            </div>
        </form>
        </div>
        <div className="">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Exigences du mot de passe :</h4>
                        <ul className="space-y-1 text-sm">
                            <li className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${passwordRequirements.minLength ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                Minimum 12 caractères
                            </li>
                            <li className={`flex items-center gap-2 ${passwordRequirements.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${passwordRequirements.hasLowercase ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                Minimum une minuscule
                            </li>
                            <li className={`flex items-center gap-2 ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${passwordRequirements.hasUppercase ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                Minimum une majuscule
                            </li>
                            <li className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${passwordRequirements.hasNumber ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                Minimum 1 chiffre
                            </li>
                            <li className={`flex items-center gap-2 ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${passwordRequirements.hasSpecialChar ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                Minimum 1 caractère spécial
                            </li>
                            <li className={`flex items-center gap-2 ${passwordRequirements.confirmPassword ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className={`w-2 h-2 rounded-full ${passwordRequirements.confirmPassword ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                Les mots de passe doivent correspondre
                            </li>
                        </ul>
                    </div>
        </div>
    )
}