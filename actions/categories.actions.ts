'use server';

import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';
import { ApiResponse } from '@/types/apiResponse';
import { Category } from '@/types/categories';
const API_BASE_URL = process.env.API_URL;


/**
 * Récupère toutes les catégories disponibles.
 * Les catégories sont souvent globales ou moins spécifiques à un utilisateur,
 * mais l'authentification peut toujours être requise pour y accéder.
 */
export async function getCategories(): Promise<ApiResponse<Category[]>> {
    const session = await auth();

    if (!session?.accessToken) {
        return { success: false, error: 'Non autorisé : Token JWT manquant pour récupérer les catégories.' };
    }

    const jwt = session.accessToken;

    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 3600, // Les catégories changent moins souvent, cache plus long (1 heure)
                tags: ['categories'], // Tag pour la revalidation à la demande
            },
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: response.statusText || 'Erreur de communication avec l\'API.' };
            }
            console.error('Erreur API (catégories):', response.status, errorData);
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de récupérer les catégories.'}`
            };
        }

        const categories: Category[] = await response.json();
        return { success: true, data: categories };

    } catch (error) {
        console.error('Erreur inattendue (catégories):', error);
        return { success: false, error: 'Une erreur serveur est survenue lors de la récupération des catégories.' };
    }
}
/**
 * Récupère toutes les catégories disponibles et les transforme pour ne renvoyer que l'ID et le nom.
 * Cette action est spécifiquement conçue pour les composants qui n'ont besoin que de ces informations.
 */
export async function getCategoriesForForm(): Promise<ApiResponse<Partial<Category>[]>> {
    const session = await auth();

    if (!session?.accessToken) {
        return { success: false, error: 'Non autorisé : Token JWT manquant pour récupérer les catégories.' };
    }

    const jwt = session.accessToken;

    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 3600, // Les catégories changent moins souvent, cache plus long (1 heure)
                tags: ['categories'], // Tag pour la revalidation à la demande
            },
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: response.statusText || 'Erreur de communication avec l\'API.' };
            }
            console.error('Erreur API (catégories pour formulaire):', response.status, errorData);
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de récupérer les catégories pour le formulaire.'}`
            };
        }

        const categories: Category[] = await response.json();

        // Transforme les catégories pour n'inclure que l'id et le nom
        const simplifiedCategories = categories.map(category => ({
            id: category.id,
            name: category.name,
        }));

        return { success: true, data: simplifiedCategories };

    } catch (error) {
        console.error('Erreur inattendue (catégories pour formulaire):', error);
        return { success: false, error: 'Une erreur serveur est survenue lors de la récupération des catégories pour le formulaire.' };
    }
}
/**
 * Action pour révalider manuellement le cache des catégories.
 * Utile si les catégories sont modifiées via une interface d'administration, par exemple.
 */
export async function revalidateCategoriesCache(): Promise<ApiResponse<null>> {

    const session = await auth();
    if (!session) {
        return { success: false, error: 'Non autorisé pour la révalidation des catégories.' };
    }

    revalidateTag('categories');
    console.log("Cache révalidé pour le tag: 'categories'");
    return { success: true, message: 'Cache des catégories révalidé.' };
}
