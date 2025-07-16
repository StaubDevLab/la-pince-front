'use server';

import { auth } from '@/auth';
import { ApiResponse } from '@/types/apiResponse';

import { BudgetFetched } from '@/types/budget'
import { DashboardData } from '@/types/dashboard'
import { fetchWithAuth } from '@/lib/fetch-with-auth';
import { revalidateTag } from 'next/cache';
const API_BASE_URL = process.env.API_URL;




/**
 * Récupère les données agrégées du tableau de bord depuis l'API /home.
 * Cette fonction est une Server Action.
 * @returns Une ApiResponse contenant les données du tableau de bord.
 */
export async function getDashboardData(): Promise<ApiResponse<DashboardData>> {
    const { data: res, error, success } = await fetchWithAuth<DashboardData>(
        `${API_BASE_URL}/home`,
        {
          method: 'GET',
          next: {
            revalidate: 300,
            tags: ['dashboard-data'],
          },
        }
      )

      if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
      }
    
      return { success: true, data: res }
}





/**
 * Récupère les budgets pour l'utilisateur authentifié.
 * Cette fonction est une Server Action.
 * @returns Une ApiResponse contenant un tableau de budgets.
 */
export async function getBudgetsForUser(): Promise<ApiResponse<BudgetFetched[]>> {
    const { data: res, error, success } = await fetchWithAuth<BudgetFetched[]>(
        `${API_BASE_URL}/budget`,
        {
          method: 'GET',
          next: {
            revalidate: 3600,
            tags: ['budgets'],
          },
        }
      )

      if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
      }
    
      return { success: true, data: res }
}

export async function revalidateUserBudgetsCache(): Promise<ApiResponse<null>> {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: 'Non autorisé pour la révalidation des budgets.' }
    }
    const userId = session.user.id
    revalidateTag(`budgets-user-${userId}`)
    revalidateTag('budgets')
    console.log(`Cache révalidé pour les tags: 'budgets-user-${userId}', 'budgets'`)
    return { success: true, message: 'Cache des budgets révalidé.' }
}

export async function revalidateUserDashboardCache(): Promise<ApiResponse<null>> {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: 'Non autorisé pour la révalidation des budgets.' }
    }
    const userId = session.user.id
    revalidateTag(`dashboard-user-${userId}`)
    revalidateTag('dashboard-data')
    console.log(`Cache révalidé pour les tags: 'dashboard-user-${userId}', 'dashboard'`)
    return { success: true, message: 'Cache des budgets révalidé.' }
}
    