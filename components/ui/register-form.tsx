'use client'

import {  z } from 'zod'
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
import { registerSchema } from '@/types/auth-schema'
type RegisterFormData = z.infer<typeof registerSchema>
export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const router = useRouter()
    const [error, setError] = useState<string>('')
    const [isRedirecting, setIsRedirecting] = useState<boolean>(false)
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
    const email = emailParam || watch('email')
    useEffect(() => {
        if (emailParam) {
            setValue('email', emailParam)
        }
    }, [emailParam])
    const onSubmit = async (data: RegisterFormData) => {
        const dataToSend = {...data, accountName: "Compte personnel", amount: 150.32}
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

            // Auto login après inscription
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
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err : any) { 
            console.error(err)
            setError( err.message || "Une erreur est survenue")
        }
    }


    return (
        <div className={cn('flex flex-col gap-2 items-center', className)} {...props}>
            <Image src={logo} alt="logo" height="100" width="75" aria-label="Logo" />
            <h1 className="text-2xl font-semibold text-center">Bienvenue sur La Pince</h1>

            <span className="text-sm text-center mb-4">
                Vous avez déjà un compte ?{' '}
                <Link href={email ? "/app/connexion?email=" + email : "/app/connexion"} className={"underline hover:text-primary"} aria-label="Se connecter">
                    Se connecter
                </Link>
            </span>

            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="text">Prénom</Label>
                            <Input id="firstname" type="text" placeholder="John" required {...register("firstName")} aria-label="Prénom"/>
                            {errors.firstName && (
                                <span className="text-sm text-red-500">
              {errors.firstName.message}
            </span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="text">Nom</Label>
                            <Input id="lastname" type="text" placeholder="Doe" required  {...register("lastName")} aria-label="Nom"/>
                            {errors.lastName && (
                                <span className="text-sm text-red-500">
              {errors.lastName.message}
            </span>
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
                                <span className="text-sm text-red-500">
              {errors.email.message}
            </span>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Mot de passe</Label>
                            </div>
                            <Input id="password" type="password" required  {...register("password")} aria-label="Mot de passe"/>
                            {errors.password && (
                                <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
                            )}
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
