'use client'
import {ForgotPasswordForm} from "@/components/ui/forgot-password-form"
import { Suspense } from 'react'

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Suspense fallback={<div>Chargement du formulaire...</div>}>
                <ForgotPasswordForm />
            </Suspense>
        </div>
    )
}