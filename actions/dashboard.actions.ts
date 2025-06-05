'use server';

import { auth } from '@/auth';
import { ApiResponse } from '@/types/apiResponse';

import { BudgetFetched } from '@/types/budget'
import { DashboardData } from '@/types/dashboard'

const API_BASE_URL = process.env.API_URL;




/**
 * Récupère les données agrégées du tableau de bord depuis l'API /home.
 * Cette fonction est une Server Action.
 * @returns Une ApiResponse contenant les données du tableau de bord.
 */
export async function getDashboardData(): Promise<ApiResponse<DashboardData>> {
    const session = await auth();

    if (!session?.accessToken) {
        return { success: false, error: 'Non autorisé : Token JWT manquant pour récupérer les données du tableau de bord.' };
    }

    const jwt = session.accessToken;
    const url = `${API_BASE_URL}/home`;

    try {

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            next: {
                tags: ['dashboard-data'], // Tag pour la révalidation spécifique du tableau de bord
                revalidate: 300 // Cache les données pendant 5 minutes (300 secondes) par défaut
            },
        });

        if (!response.ok) {
            console.log("ERREUR")
            let errorData;
            try {
                errorData = await response.json();
                console.error('getDashboardData: Erreur API (status:', response.status, ') - Données d\'erreur:', errorData);
            } catch (e) {
                errorData = { message: response.statusText || 'Erreur de communication avec l\'API.' };
                console.error('getDashboardData: Erreur API (status:', response.status, ') - Impossible de parser la réponse d\'erreur:', e);
            }
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de récupérer les données du tableau de bord.'}`

            };
        }

        const data: DashboardData = await response.json();
        console.log('getDashboardData: Réponse API réussie - Données brutes:', data);
        return { success: true, data: data };

    } catch (error) {
        console.error('getDashboardData: Erreur inattendue lors de la récupération des données du tableau de bord:', error);
        return { success: false, error: 'Une erreur serveur est survenue lors de la récupération des données du tableau de bord.' };
    }
}





/**
 * Récupère les budgets pour l'utilisateur authentifié.
 * Cette fonction est une Server Action.
 * @returns Une ApiResponse contenant un tableau de budgets.
 */
export async function getBudgetsForUser(): Promise<ApiResponse<BudgetFetched[]>> {
    const session = await auth();

    if (!session?.accessToken) {
        console.error('getBudgetsForUser: Non autorisé - Token JWT manquant.');
        return { success: false, error: 'Non autorisé : Token JWT manquant pour récupérer les budgets.' };
    }

    const jwt = session.accessToken;
    const url = `${API_BASE_URL}/budget`;

    try {
        console.log(`getBudgetsForUser: Appel API à ${url}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            next: {
                tags: ['budgets'], // Tag pour la révalidation à la demande
                revalidate: 3600 // Cache les budgets pendant 1 heure par défaut
            },
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
                console.error('getBudgetsForUser: Erreur API (status:', response.status, ') - Données d\'erreur:', errorData);
            } catch (e) {
                errorData = { message: response.statusText || 'Erreur de communication avec l\'API.' };
                console.error('getBudgetsForUser: Erreur API (status:', response.status, ') - Impossible de parser la réponse d\'erreur:', e);
            }
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de récupérer les budgets.'}`
            };
        }

        const data: BudgetFetched[] = await response.json();
        console.log('getBudgetsForUser: Réponse API réussie - Données brutes:', data);

        if (!Array.isArray(data)) {
            console.error('getBudgetsForUser: Format de réponse API inattendu. Les données ne sont pas un tableau.', data);
            return { success: false, error: 'Format de réponse API inattendu pour les budgets.' };
        }

        return { success: true, data: data };

    } catch (error) {
        console.error('getBudgetsForUser: Erreur inattendue lors de la récupération des budgets:', error);
        return { success: false, error: 'Une erreur serveur est survenue lors de la récupération des budgets.' };
    }
}

