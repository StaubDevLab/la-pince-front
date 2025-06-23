'use server'
import { ApiResponse } from '@/types/apiResponse'
export const forgotPasswordAction = async (email: string): Promise<ApiResponse<null>> => {
    const res = await fetch(`${process.env.API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
    if (!res.ok) {
        return { success: false, error: 'Erreur lors de la réinitialisation du mot de passe' }
    }
    return { success: true }
}

export const resetPasswordAction = async ( newPassword: string, token: string, confirmNewPassword: string): Promise<ApiResponse<null>> => {
    const res = await fetch(`${process.env.API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({  newPassword, token, confirmNewPassword }),
    })
    if (!res.ok) {
        return { success: false, error: 'Erreur lors de la réinitialisation du mot de passe' }
    }
    return { success: true }
}


