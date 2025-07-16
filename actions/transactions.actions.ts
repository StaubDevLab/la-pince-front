'use server'

import { auth } from '@/auth'
import { ApiResponse } from '@/types/apiResponse'
import { revalidateTag } from 'next/cache'
import { Transaction, ApiPayloadTransaction } from '@/types/transactions'
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

    // Gérer la conversion des dates de chaînes ISO en objets Date
    const formattedData = data.data.map(t => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
        recurringStartDate: t.recurringStartDate ? new Date(t.recurringStartDate) : null,
        recurringEndDate: t.recurringEndDate ? new Date(t.recurringEndDate) : null,
    }));


    return { success: true, data: { ...data, data: formattedData } }
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
 * @param payload Les données de la transaction à créer, au format attendu par l'API.
 * @returns Une ApiResponse indiquant le succès ou l'échec de l'opération.
 */
export async function createTransaction(payload: ApiPayloadTransaction): Promise<ApiResponse<{ amount: number }>> {
    const { data: res, error, success } = await fetchWithAuth<{ totalUserAccountAmount: number }>(
        `${API_BASE_URL}/transactions`,
        {
            method: 'POST',
            body: JSON.stringify(payload),
        }
    )

    if (!success || !res) {
        return { success: false, error: error || 'Erreur lors de la création.' }
    }

    revalidateTag('transactions')
    console.log("Cache révalidé pour le tag: 'transactions' après création.")
    return { success: true, data: { amount: res.totalUserAccountAmount }, message: 'Transaction créée.' }
}


export async function deleteTransaction(id: string): Promise<ApiResponse<null>> {
    const { success, error } = await fetchWithAuth<any>( 
         `${API_BASE_URL}/transactions/${id}`,
         {
           method: 'DELETE',
           next: {
             
             tags: ['transactions'], 
           },
         }
       )
 
       if (!success) { 
         return { success: false, error: error || 'Erreur lors de la suppression.' } 
       }
     
       
       await revalidateUserTransactionsCache()
       return { success: true, message: 'Transaction supprimée avec succès' }
 }

/**
 * Met à jour une transaction existante en envoyant les données à l'API.
 * @param id L'ID de la transaction à mettre à jour.
 * @param payload Les données de la transaction modifiées, au format attendu par l'API.
 * @returns Une ApiResponse<{ amount: number }> indiquant le succès ou l'échec de l'opération, incluant le nouvel amount.
 */
export async function updateTransaction(id: string, payload: ApiPayloadTransaction): Promise<ApiResponse<{ amount: number }>> { // <--- MODIFICATION ICI
    const { data: res, error, success } = await fetchWithAuth<{ totalUserAccountAmount: number }>(
        `${API_BASE_URL}/transactions/${id}?updateNextChilds=false`,
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
    return { success: true, data: { amount: res.totalUserAccountAmount }, message: 'Transaction modifiée avec succès' }
}

/**
 * Arrête la récurrence d'une transaction spécifique.
 * @param transactionId L'ID de la transaction récurrente à arrêter.
 * @returns Une ApiResponse indiquant le succès ou l'échec de l'opération.
 */
export async function stopRecurringTransaction(transactionId: string): Promise<ApiResponse<null>> {
    console.log(`Tentative d'arrêt de la récurrence pour la transaction ID: ${transactionId}`);
    try {
        const { success, error } = await fetchWithAuth<any>(
            `${API_BASE_URL}/transactions/recurring/stop/${transactionId}`,
            {
                method: 'DELETE', 
            }
        );

        if (!success) {
            console.error(`Erreur lors de l'arrêt de la récurrence pour ${transactionId}:`, error);
            return { success: false, error: error || "Échec de l'arrêt de la récurrence." };
        }

        await revalidateUserTransactionsCache();
        console.log(`Récurrence arrêtée avec succès pour la transaction ID: ${transactionId}`);
        return { success: true, message: 'Récurrence de la transaction arrêtée avec succès.' };
    } catch (err: any) {
        console.error(`Exception lors de l'arrêt de la récurrence pour ${transactionId}:`, err);
        return { success: false, error: `Erreur interne du serveur: ${err.message}` };
    }
}