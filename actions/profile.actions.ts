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

/**
 * Action pour configurer le profil initial de l'utilisateur (firstLogin).
 */
export async function completeProfileSetup(profileData: {
  accountName: string
  currency: "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "CHF" | "CNY" | "SEK" | "NZD"
  locale: "fr-FR" | "en-US" | "es-ES" | "de-DE" | "it-IT"
  totalAmount: number
}): Promise<ApiResponse<null>> {
    console.log("profileData",profileData)
  const {
    data: res,
    error,
    success,
  } = await fetchWithAuth<null>(`${API_BASE_URL}/users/first-login`, {
    method: "POST",
    body: JSON.stringify(profileData),
    next: {
      revalidate: 300,
      tags: ["profile"],
    },
  })

  if (!success || !res) {
    return { success: false, error: error || "Erreur lors de la configuration du profil" }
  }

  // Révalider le cache du profil après la mise à jour
  revalidateTag("profile")
  

  return { success: true, data: null }
}