'use server'

import { auth } from '@/auth' 
import { ApiResponse } from '@/types/apiResponse'
import { revalidateTag } from 'next/cache';

export async function updateProfileAndSession(newProfile: { firstName: string,lastName: string, email: string }): Promise<ApiResponse<null>> {
    const session = await auth()
    if (!session?.accessToken) {
        return { success: false, error: 'Non autorisé' }
    }

    const res = await fetch(`${process.env.API_URL}/users`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProfile),
    })

    if (!res.ok) {
      
        return { success: false, error: 'Erreur lors de la mise à jour du profil' }
    }
 revalidateTag('profile');
    await revalidateProfileCache();
    return { success: true }
}

export async function getProfile(): Promise<ApiResponse<{
    accountName: string, firstName: string, lastName: string, email: string 
}>> {
    const session = await auth()
    if (!session?.accessToken || !session.user?.id) {
        return { success: false, error: 'Non autorisé' }
    }

    const res = await fetch(`${process.env.API_URL}/users/${session.user.id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
        },
        next: {
            revalidate: 300, // Revalidation toutes les 5 minutes
            tags: ['profile'], // Tag pour la revalidation à la demande
        },
    })

    if (!res.ok) {
        return { success: false, error: 'Erreur lors de la récupération du profil' }
    }

    const profile = await res.json()
    return { success: true, data: profile }
}

/**
 * Action pour révalider manuellement le cache des transactions.
 */
export async function revalidateProfileCache(): Promise<ApiResponse<null>> {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: 'Non autorisé pour la révalidation des profile.' };
    }
    const userId = session.user.id;
    revalidateTag(`profile-${userId}`);
    revalidateTag('profile');
    console.log(`Cache révalidé pour les tags: 'profile-${userId}', 'profile'`);
    return { success: true, message: 'Cache des profile révalidé.' };
}