'use client'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import logo from '@/public/la-pince-logo.png'
import Link from 'next/link'
import { forgotPasswordSchema } from '@/types/auth-schema'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { forgotPasswordAction } from '@/actions/auth.actions'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const router = useRouter()
    const [error, setError] = useState<string>('')
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const email = useSearchParams().get("email")

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }, 
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })
    useEffect(() => {
        if (email) {
            setValue('email', email)
        }
    }, [email])
   

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setError(''); 
        setIsButtonDisabled(true); 

        try {
            const result = await forgotPasswordAction(data.email)
            if (!result.success) {
                setError('Une erreur est survenue');
                setIsButtonDisabled(false); 
                return;
            }
            toast.success('Un email de réinitialisation a été envoyé à votre adresse email');
            router.push('/connexion?email=' + email);
            
            
        } catch (error) {
            console.error('Erreur lors de la connexion', error);
            setError('Une erreur est survenue');
            setIsButtonDisabled(false); 
        }
    }
    return (
        <div className={cn('flex flex-col gap-2 items-center', className)} {...props}>
            <Image src={logo} alt="logo" height={100} width={75} />
            <h1 className="text-2xl font-semibold text-center">Demande de réinitialisation de mot de passe</h1>

            <span className="text-sm text-center mb-4">
                Retour à la{' '}
                <Link href={'/connexion?email=' + email} className={'underline hover:text-primary'}>
                    connexion
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
                        
                        {error && (
                            <div className="bg-red-50 p-4 rounded-md">
                                <p className="text-sm text-red-500">{error}</p>
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isButtonDisabled}>
                            {isSubmitting ? 'Envoi...' : 'Réinitialiser'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}