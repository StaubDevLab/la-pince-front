'use client'


import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import logo from '@/public/la-pince-logo.png'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { registerSchema, RegisterFormData } from '@/types/auth-schema'

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const router = useRouter()
    const [error, setError] = useState<string>('')
    const [isRedirecting, setIsRedirecting] = useState<boolean>(false)
    const [passwordValidations, setPasswordValidations] = useState({
        minLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        confirmPassword: false,
    })
    const emailParam = useSearchParams().get("email")

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const email = emailParam || watch('email') || ''
    const password = watch('password', '')
    const confirmPassword = watch('confirmPassword', '')

    useEffect(() => {
        if (emailParam) {
            setValue('email', emailParam)
        }
    }, [emailParam, setValue])

    useEffect(() => {
        setPasswordValidations({
            minLength: password.length >= 12,
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            confirmPassword: password === confirmPassword && password !== '',
        })
    }, [password, confirmPassword])

    const onSubmit = async (data: RegisterFormData) => {
        if (!Object.values(passwordValidations).every(Boolean)) {
            setError('Veuillez vérifier que le mot de passe répond à tous les critères')
            return
        }

        const dataToSend = { ...data, accountName: "Compte personnel", amount: 150.32 }
        try {
            const res = await fetch('https://api.la-pince.tech/v1/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            })

            if (!res.ok) {
                const { message } = await res.json()
                setError(message || "Erreur d'inscription")
                throw new Error(message || "Erreur d'inscription")
            }

            const loginResult = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (loginResult?.error) {
                setError("Compte créé, mais impossible de vous connecter automatiquement.")
                return
            }

            setIsRedirecting(true)
            router.push('/dashboard')
            router.refresh()
        } catch (err: unknown) {
            const error = err as Error
            console.error(error)
            setError(error.message || "Une erreur est survenue")
        }
    }

    return (
        <div className={cn('flex flex-col gap-2 items-center', className)} {...props}>
            <Image src={logo} alt="logo" height="100" width="75" aria-label="Logo" />
            <h1 className="text-2xl font-semibold text-center">Bienvenue sur La Pince</h1>

            <span className="text-sm text-center mb-4">
                Vous avez déjà un compte ?{' '}

                <Link href={email ? `/app/connexion?email=${email}` : "/app/connexion"} className={"underline hover:text-primary"} aria-label="Se connecter">

                    Se connecter
                </Link>
            </span>

            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="firstname">Prénom</Label>
                            <Input id="firstname" type="text" placeholder="John" required {...register("firstName")} aria-label="Prénom"/>
                            {errors.firstName && (
                                <span className="text-sm text-red-500">{errors.firstName.message}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastname">Nom</Label>
                            <Input id="lastname" type="text" placeholder="Doe" required {...register("lastName")} aria-label="Nom"/>
                            {errors.lastName && (
                                <span className="text-sm text-red-500">{errors.lastName.message}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john.doe@gmail.com"
                                required
                                {...register("email")}
                                aria-label="Email"
                            />
                            {errors.email && (
                                <span className="text-sm text-red-500">{errors.email.message}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input id="password" type="password" required {...register("password")} aria-label="Mot de passe"/>
                            {errors.password && (
                                <span className="text-sm text-red-500">{errors.password.message}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <Input id="confirmPassword" type="password" required {...register("confirmPassword")} aria-label="Confirmer le mot de passe"/>
                            {errors.confirmPassword && (
                                <span className="text-sm text-red-500">{errors.confirmPassword.message}</span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <ul className="text-sm">
                                <li className={cn("flex items-center gap-2", passwordValidations.minLength ? "text-green-500" : "text-gray-500")}>
                                    {passwordValidations.minLength ? "✓" : "○"} Au moins 12 caractères
                                </li>
                                <li className={cn("flex items-center gap-2", passwordValidations.hasLowercase ? "text-green-500" : "text-gray-500")}>
                                    {passwordValidations.hasLowercase ? "✓" : "○"} Une lettre minuscule
                                </li>
                                <li className={cn("flex items-center gap-2", passwordValidations.hasUppercase ? "text-green-500" : "text-gray-500")}>
                                    {passwordValidations.hasUppercase ? "✓" : "○"} Une lettre majuscule
                                </li>
                                <li className={cn("flex items-center gap-2", passwordValidations.hasNumber ? "text-green-500" : "text-gray-500")}>
                                    {passwordValidations.hasNumber ? "✓" : "○"} Un chiffre
                                </li>
                                <li className={cn("flex items-center gap-2", passwordValidations.hasSpecialChar ? "text-green-500" : "text-gray-500")}>
                                    {passwordValidations.hasSpecialChar ? "✓" : "○"} Un caractère spécial
                                </li>
                                <li className={cn("flex items-center gap-2", passwordValidations.confirmPassword ? "text-green-500" : "text-gray-500")}>
                                    {passwordValidations.confirmPassword ? "✓" : "○"} Mots de passe identiques
                                </li>
                            </ul>
                        </div>
                        {error && (
                            <div className="p-2 bg-red-300 text-red-800 rounded-md" aria-label="Erreur d'inscription">
                                <p className="text-md text-red-500">{error}</p>
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isSubmitting || isRedirecting} aria-label="S'inscrire">
                            {isSubmitting || isRedirecting ? 'Inscription...' : "S'inscrire"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}