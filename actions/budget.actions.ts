'use server'

import { auth } from "@/auth";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { ApiResponse } from "@/types/apiResponse";
import { BudgetFormType } from "@/types/budget";
import { User } from "@/types/user";
import { revalidateTag } from "next/cache";
const API_BASE_URL = process.env.API_URL
export async function createBudget(data: BudgetFormType): Promise<ApiResponse<{ amount: number }>> {
    const { data: res, error, success } = await fetchWithAuth<{ totalUserAccountAmount: number }>(
      `${API_BASE_URL}/budget`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        next: {
          revalidate: 300,
          tags: ['budget'],
        },
      }
    )
  
    if (!success || !res) {
      return { success: false, error: error || 'Erreur inconnue' }
    }
  
    await revalidateUserBudgetsCache()
    return { success: true, data: { amount: res.totalUserAccountAmount }, message: 'Budget créé avec succès' }
  }

export const deleteBudget = async (budgetId: string): Promise<ApiResponse<null>> => {
    
    const { data: res, error, success } = await fetchWithAuth<{ totalUserAccountAmount: number }>(
        `${API_BASE_URL}/budget/${budgetId}`,
        {
          method: 'DELETE',
          next: {
            revalidate: 300,
            tags: ['budget'],
          },
        }
      )

      if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
      }
    
      await revalidateUserBudgetsCache()
      return { success: true, message: 'Budget supprimé avec succès' }
}
export const updateBudget = async(budgetId: string, data: BudgetFormType): Promise<ApiResponse<null>> => {
   const { data: res, error, success } = await fetchWithAuth<{ totalUserAccountAmount: number }>(
        `${API_BASE_URL}/budget/${budgetId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
          next: {
            revalidate: 300,
            tags: ['budget'],
          },
        }
      )

      if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
      }
    
      await revalidateUserBudgetsCache()
      return { success: true, message: 'Budget modifié avec succès' }
}

export const updateGlobalBudget = async ({ userId, amount }: { userId: string, amount: number }): Promise<ApiResponse<User>> => {
  const { data: res, error, success } = await fetchWithAuth<User>(
    `${API_BASE_URL}/account/user/${userId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ amount })
    }
  )
  if (!success || !res) {
      return { success: false, error: error || 'Erreur inconnue' }
  }
  return { success: true, message: 'Budget global modifié avec succès' }
}

export const revalidateUserBudgetsCache = async (): Promise<ApiResponse<null>> => {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: 'Non autorisé pour la révalidation des budgets.' }
    }
    const userId = session.user.id
    revalidateTag('budget')
    revalidateTag(`budgets-user-${userId}`)
    console.log(`Cache révalidé pour les tags: 'budget'`)
    return { success: true, message: 'Cache des budgets révalidé.' }
}