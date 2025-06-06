'use server'

import { auth } from '@/auth'
import { ApiResponse } from '@/types/apiResponse'
import { revalidateTag } from 'next/cache'
import { Transaction, TransactionPayloadBeforeFormat } from '@/types/transactions' // Import revalidateTag

const API_BASE_URL = process.env.API_URL
/**
 * Récupère les transactions pour l'utilisateur connecté.
 */
export async function getTransactionsForUser(limit = 0, page = 1): Promise<ApiResponse<{ data: Transaction[]; limit: number; page: number; total: number }>> {
    const session = await auth()

    if (!session?.user?.id || !session?.accessToken) {
        return { success: false, error: 'Non autorisé : Session utilisateur ou token JWT manquant.' }
    }

    const userId = session.user.id
    const jwt = session.accessToken

    const params = new URLSearchParams()
    if (limit > 0) params.append('limit', limit.toString())
    if (page > 0) params.append('page', page.toString())

    const url = `${API_BASE_URL}/transactions${params.size ? `?${params.toString()}` : ''}`

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 300, // Revalider toutes les 5 minutes
                tags: ['transactions', `transactions-user-${userId}`],
            },
        })

        if (!response.ok) {
            let errorData
            try {
                errorData = await response.json()
            } catch (e) {
                errorData = { message: response.statusText || "Erreur de communication avec l'API." }
            }
            console.error('Erreur API (transactions):', response.status, errorData)
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de récupérer les transactions.'}`,
            }
        }

        const transactions = await response.json()
        return { success: true, data: transactions }
    } catch (error) {
        console.error('Erreur inattendue (transactions):', error)
        return { success: false, error: 'Une erreur serveur est survenue lors de la récupération des transactions.' }
    }
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
export async function createTransaction(data: TransactionPayloadBeforeFormat): Promise<ApiResponse<null>> {
    console.log('coucou')
    const session = await auth()

    if (!session?.accessToken) {
        return { success: false, error: 'Non autorisé : Token JWT manquant pour créer la transaction.' }
    }

    const jwt = session.accessToken

    const payload = {
        amount: Number(data.amount),
        transactionType: Number(data.transactionType),
        description: data.description?.trim() || '',
        categoryId: data.category,
        isReccuring: data.isRecurring,
        reccuringFrequency: data.isRecurring ? Number(data.reccuringFrequency) : null,
        reccuringStartDate: data.isRecurring && data.dateRange?.from ? new Date(data.dateRange.from).toISOString() : null,
        reccuringEndDate: data.isRecurring && data.dateRange?.to ? new Date(data.dateRange.to).toISOString() : null,
        date: new Date().toISOString(),
    }

    try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            let errorData
            try {
                errorData = await response.json()
            } catch (e) {
                errorData = { message: response.statusText || "Erreur de communication avec l'API." }
            }
            console.error('Erreur API (création transaction):', response.status, errorData)
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de créer la transaction.'}`,
            }
        }

        revalidateTag('transactions')
        console.log("Cache révalidé pour le tag: 'transactions' après création.")
        return { success: true, message: 'Transaction créée avec succès.' }
    } catch (error) {
        console.error('Erreur inattendue (création transaction):', error)
        return { success: false, error: 'Une erreur serveur est survenue lors de la création de la transaction.' }
    }
}

export async function deleteTransaction(id: string): Promise<ApiResponse<null>> {
    const session = await auth()
    if (!session?.accessToken || !session?.user?.id) {
        return { success: false, error: 'Non autorisé : token ou utilisateur manquant.' }
    }

    const jwt = session.accessToken
    const userId = session.user.id

    try {
        const response = await fetch(`${process.env.API_URL}/transactions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de modifier la transaction.'}`,
            }
        }

        // Invalider le cache
        revalidateTag('transactions')
        revalidateTag(`transactions-user-${userId}`)

        return { success: true, message: 'Transaction supprimer avec succès.' }
    } catch (error: any) {
        return { success: false, error: error.message || 'Une erreur serveur est survenue.' }
    }
}

export async function updateTransaction(id: string, data: TransactionPayloadBeforeFormat): Promise<ApiResponse<null>> {
    const session = await auth()

    if (!session?.accessToken || !session?.user?.id) {
        return { success: false, error: 'Non autorisé : token ou utilisateur manquant.' }
    }

    const jwt = session.accessToken
    const userId = session.user.id

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

    try {
        const response = await fetch(`${process.env.API_URL}/transactions/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorData = await response.json()
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de modifier la transaction.'}`,
            }
        }

        // Invalider le cache
        revalidateTag('transactions')
        revalidateTag(`transactions-user-${userId}`)

        return { success: true, message: 'Transaction modifiée avec succès.' }
    } catch (error: any) {
        return { success: false, error: error.message || 'Une erreur serveur est survenue.' }
    }
}
