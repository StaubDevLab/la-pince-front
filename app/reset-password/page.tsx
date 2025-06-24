

import {ResetPasswordForm} from "@/components/ui/reset-password"
import { Suspense } from 'react'
export default function ResetPassword() {

   
    return <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <Suspense fallback={<div>Chargement du formulaire...</div>}>
                    <ResetPasswordForm />
                </Suspense>
               
            </div>
}