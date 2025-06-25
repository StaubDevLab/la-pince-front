'use server'

import { auth } from '@/auth'
import { ApiResponse } from '@/types/apiResponse'
import { revalidateTag } from 'next/cache';
import { PasswordFormData } from '@/types/user'
import { fetchWithAuth } from '@/lib/fetch-with-auth';
const API_BASE_URL = process.env.API_URL
export async function updateProfileAndSession(newProfile: { firstName: string,lastName: string, email: string }): Promise<ApiResponse<null>> {
    const { data: res, error, success } = await fetchWithAuth<null>(
        `${API_BASE_URL}/users`,
        {
            method: 'PATCH',
            body: JSON.stringify(newProfile),
            next: {
                revalidate: 300,
                tags: ['profile'],
            },
        }
    )
    if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
    }
    return { success: true, data: null }
}

export async function getProfile(): Promise<ApiResponse<{
    accountName: string, firstName: string, lastName: string, email: string
}>> {
    const { data: res, error, success } = await fetchWithAuth<{accountName: string, firstName: string, lastName: string, email: string}>(
        `${API_BASE_URL}/users`,
        {
            method: 'GET',
            next: {
                revalidate: 300,
                tags: ['profile'],
            },
        }
    )
    if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
    }
    return { success: true, data: res }
}




/**
 * Action pour changer le mot de passe de l'utilisateur.
 */
export async function changePasswordAction(data: PasswordFormData) {
    const { data: res, error, success } = await fetchWithAuth<{accountName: string, firstName: string, lastName: string, email: string}>(
        `${API_BASE_URL}/users/password`,
        {
            method: 'PATCH',
            body: JSON.stringify(data),
            next: {
                revalidate: 300,
                tags: ['profile'],
            },
        }
    )
    if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
    }
    return { success: true, data: res }
}
/**
 * Action pour révalider manuellement le cache des transactions.
 */
export async function revalidateProfileCache(): Promise<ApiResponse<null>> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: 'Non autorisé pour la révalidation des profil.' };
    }
    const userId = session.user.id;
    revalidateTag(`profile-${userId}`);
    revalidateTag('profile');
    console.log(`Cache révalidé pour les tags: 'profile-${userId}', 'profile'`);
    return { success: true, message: 'Cache des profile révalidé.' };
}
