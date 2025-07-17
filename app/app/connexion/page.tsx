import { LoginForm } from '@/components/ui/login-form'
import { Suspense } from 'react'

export default function Connexion() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
            <Suspense fallback={<div>Chargement du formulaire...</div>}>
                <LoginForm />
            </Suspense>
            </div>
        </div>
    )
}
