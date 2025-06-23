'use client'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from "next-auth/react"
import Image from 'next/image'
import logo from '@/public/la-pince-logo.png'
import Link from 'next/link'
import { loginSchema } from '@/types/auth-schema'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

export type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const router = useRouter()
    const [error, setError] = useState<string>('')
    // New state to control button disabled status
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }, // isSubmitSuccessful is no longer needed here for button control
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: LoginFormData) => {
        setError(''); // Clear previous errors
        setIsButtonDisabled(true); // Disable button immediately on submission

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                setError('Identifiants invalides, veuillez réessayer');
                setIsButtonDisabled(false); // Re-enable button on authentication error
                return;
            }
            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            console.error('Erreur lors de la connexion', error);
            setError('Une erreur est survenue');
            setIsButtonDisabled(false); // Re-enable button on general error
        }
    }
    return (
        <div className={cn('flex flex-col gap-2 items-center', className)} {...props}>
            <Image src={logo} alt="logo" height={100} width={75} />
            <h1 className="text-2xl font-semibold text-center">Bienvenue sur La Pince</h1>

            <span className="text-sm text-center mb-4">
                Pas de compte ?{' '}
                <Link href={'/inscription'} className={'underline hover:text-primary'}>
                    Créer en un ici
                </Link>
            </span>

            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email')}
                                placeholder="john.doe@gmail.com"
                                required
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
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Mot de passe oublié ?
                                </a>
                            </div>
                            <Input {...register('password')} type="password" required />
                            {errors.password && (
                                <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
                            )}
                        </div>
                        {error && (
                            <div className="bg-red-50 p-4 rounded-md">
                                <p className="text-sm text-red-500">{error}</p>
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isButtonDisabled}>
                            {isSubmitting ? 'Connexion...' : 'Connexion'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}