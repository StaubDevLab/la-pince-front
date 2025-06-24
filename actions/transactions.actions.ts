'use server'

import { auth } from '@/auth'
import { ApiResponse } from '@/types/apiResponse'
import { revalidateTag } from 'next/cache'
import { Transaction, TransactionPayloadBeforeFormat } from '@/types/transactions' // Import revalidateTag
import { fetchWithAuth } from '@/lib/fetch-with-auth';
const API_BASE_URL = process.env.API_URL
/**
 * Récupère les transactions pour l'utilisateur connecté.
 */
export async function getTransactionsForUser(
    limit = 0,
    page = 1
  ): Promise<ApiResponse<{ data: Transaction[]; limit: number; page: number; total: number }>> {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: 'Non autorisé : utilisateur manquant.' }
    }
  
    const userId = session.user.id
    const params = new URLSearchParams()
    if (limit > 0) params.append('limit', limit.toString())
    if (page > 0) params.append('page', page.toString())
  
    const url = `${API_BASE_URL}/transactions${params.size ? `?${params.toString()}` : ''}`
  
    const { data, error, success } = await fetchWithAuth<{ data: Transaction[]; limit: number; page: number; total: number }>(
      url,
      {
        method: 'GET',
        next: {
          revalidate: 300,
          tags: ['transactions', `transactions-user-${userId}`],
        },
      }
    )
  
    if (!success || !data) {
      return { success: false, error: error || 'Erreur inconnue.' }
    }
  
    return { success: true, data }
  }
  

/**
 * Action pour révalider manuellement le cache des transactions.
 */
export async function revalidateUserTransactionsCache(): Promise<ApiResponse<null>> {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: 'Non autorisé pour la révalidation des transactions.' }
    }
    const userId = session.user.id
    revalidateTag(`transactions-user-${userId}`)
    revalidateTag('transactions')
    console.log(`Cache révalidé pour les tags: 'transactions-user-${userId}', 'transactions'`)
    return { success: true, message: 'Cache des transactions révalidé.' }
}
/**
 * Crée une nouvelle transaction en envoyant les données à l'API.
 * Après une création réussie, le cache des transactions est révalidé.
 * @param data Les données de la transaction à créer.
 * @returns Une ApiResponse indiquant le succès ou l'échec de l'opération.
 */
export async function createTransaction(data: TransactionPayloadBeforeFormat): Promise<ApiResponse<{ amount: number }>> {
    const { data: res, error, success } = await fetchWithAuth<{ totalUserAccountAmount: number }>(
      `${API_BASE_URL}/transactions`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  
    if (!success || !res) {
      return { success: false, error: error || 'Erreur lors de la création.' }
    }
  
    // Revalider après mutation
    revalidateTag('transactions')
    console.log("Cache révalidé pour le tag: 'transactions' après création.")
    return { success: true, data: { amount: res.totalUserAccountAmount }, message: 'Transaction créée.' }
  }
  

export async function deleteTransaction(id: string): Promise<ApiResponse<null>> {
   const { data: res, error, success } = await fetchWithAuth<{ totalUserAccountAmount: number }>(
        `${API_BASE_URL}/transactions/${id}`,
        {
          method: 'DELETE',
          next: {
            revalidate: 300,
            tags: ['transactions'],
          },
        }
      )

      if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
      }
    
      await revalidateUserTransactionsCache()
      return { success: true, message: 'Transaction supprimée avec succès' }
}

export async function updateTransaction(id: string, data: TransactionPayloadBeforeFormat): Promise<ApiResponse<null>> {
    const payload = {
        amount: Number(data.amount),
        transactionType: Number(data.transactionType),
        description: data.description?.trim() || '',
        categoryId: data.category,
        isReccuring: data.isRecurring,
        reccuringFrequency: data.isRecurring ? Number(data.reccuringFrequency) : null,
        reccuringStartDate: data.isRecurring && data.dateRange?.from ? new Date(data.dateRange?.from).toISOString() : null,
        reccuringEndDate: data.isRecurring && data.dateRange?.to ? new Date(data.dateRange?.to).toISOString() : null,
        date: new Date().toISOString(),
    }
    const { data: res, error, success } = await fetchWithAuth<{ totalUserAccountAmount: number }>(
        `${API_BASE_URL}/transactions/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
          next: {
            revalidate: 300,
            tags: ['transactions'],
          },
        }
      )

      if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
      }
    
      await revalidateUserTransactionsCache()
      return { success: true, message: 'Transaction modifiée avec succès' }
}
