'use server'

import { auth } from "@/auth";
import { ApiResponse } from "@/types/apiResponse";
import { BudgetFormType } from "@/types/budget";
import { revalidateTag } from "next/cache";
const API_BASE_URL = process.env.API_URL
export async function createBudget(data: BudgetFormType): Promise<ApiResponse<{amount: number}>> {
    
    const session = await auth()

    if (!session?.accessToken) {
        return { success: false, error: 'Non autorisé : Token JWT manquant pour créer la transaction.' }
    }

    const jwt = session.accessToken

    


    try {
        const response = await fetch(`${API_BASE_URL}/budget`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify(data),
            next: {
                revalidate: 300,
                tags: ['budget'],
            },
        })

        if (!response.ok) {
            let errorData
            try {
                errorData = await response.json()
            } catch (e) {
                errorData = { message: response.statusText || "Erreur de communication avec l'API." }
            }
            console.error('Erreur API (création budget):', response.status, errorData)
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de créer le budget.'}`,
            }
        }
        const res = await response.json()
        const amount = res.totalUserAccountAmount
     
        revalidateUserBudgetsCache()
        console.log("Cache révalidé pour le tag: 'budget' après création.")
        return { success: true, message: 'Budget créé avec succès.',data: { amount } }
    } catch (error) {
        console.error('Erreur inattendue (création budget):', error)
        return { success: false, error: 'Une erreur serveur est survenue lors de la création du budget.' }
    }
}

export const deleteBudget = async (budgetId: string): Promise<ApiResponse<null>> => {
    
    const session = await auth()

    if (!session?.accessToken) {
        return { success: false, error: 'Non autorisé : Token JWT manquant pour supprimer le budget.' }
    }

    const jwt = session.accessToken

    try {
        const response = await fetch(`${API_BASE_URL}/budget/${budgetId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
            },
            next: {
                revalidate: 300,
                tags: ['budget'],
            },
        })

        if (!response.ok) {
            let errorData
            try {
                errorData = await response.json()
            } catch (e) {
                errorData = { message: response.statusText || "Erreur de communication avec l'API." }
            }
            console.error('Erreur API (suppression budget):', response.status, errorData)
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de supprimer le budget.'}`,
            }
        }
        revalidateUserBudgetsCache()
        console.log("Cache révalidé pour le tag: 'budget' après suppression.")
        return { success: true, message: 'Budget supprimé avec succès.' }
    } catch (error) {
        console.error('Erreur inattendue (suppression budget):', error)
        return { success: false, error: 'Une erreur serveur est survenue lors de la suppression du budget.' }
    }
}

export const revalidateUserBudgetsCache = async (): Promise<ApiResponse<null>> => {
    const session = await auth()
    if (!session?.user?.id) {
        return { success: false, error: 'Non autorisé pour la révalidation des budgets.' }
    }
    const userId = session.user.id
    revalidateTag('budget')
    console.log(`Cache révalidé pour les tags: 'budget'`)
    return { success: true, message: 'Cache des budgets révalidé.' }
}