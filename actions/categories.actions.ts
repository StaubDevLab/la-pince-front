'use server';

import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';
import { ApiResponse } from '@/types/apiResponse';
import { Category } from '@/types/categories';
const API_BASE_URL = process.env.API_URL;

/**
 * Méthodes pour récupérer les catégories depuis l'API.
 * 
 */
async function fetchCategories(): Promise<ApiResponse<Category[]>> {
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
                revalidate: 3600,// Les catégories changent moins souvent, cache plus long (1 heure)
                tags: ['categories'],// Tag pour la revalidation à la demande
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
 * Renvoie la liste complète des catégories avec toutes les propriétés.
 */
export async function getCategories(): Promise<ApiResponse<Category[]>> {
    return fetchCategories();
}

/**
 * Renvoie une liste simplifiée des catégories pour les formulaires.
 * Contient uniquement les propriétés nécessaires (id et name).
 */
export async function getCategoriesForForm(): Promise<ApiResponse<Partial<Category>[]>> {
    const result = await fetchCategories();
    if (!result.success || !result.data) return result;

    const simplifiedCategories = result.data.map(category => ({
        id: category.id,
        name: category.name,
    }));

    return { success: true, data: simplifiedCategories };
}

/**
 * Récupère une catégorie par son id.
 */
export async function getCategoryById(id: string | number): Promise<ApiResponse<Category>> {
    const session = await auth();

    if (!session?.accessToken) {
        return { success: false, error: 'Non autorisé : Token JWT manquant pour récupérer la catégorie.' };
    }

    const jwt = session.accessToken;

    try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 3600,
                tags: [`categories`, `category-${id}`], // Tag pour la revalidation à la demande
            },
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: response.statusText || 'Erreur de communication avec l\'API.' };
            }
            console.error('Erreur API (catégorie):', response.status, errorData);
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de récupérer la catégorie.'}`
            };
        }

        const category: Category = await response.json();
        return { success: true, data: category };

    } catch (error) {
        console.error('Erreur inattendue (catégorie):', error);
        return { success: false, error: 'Une erreur serveur est survenue lors de la récupération de la catégorie.' };
    }
}

export async function createCategory(categoryProps: Pick<Category, 'color' | 'icon' | 'name'>) {
        const session = await auth();

        if (!session?.accessToken) {
            return { success: false, error: 'Non autorisé : Token JWT manquant pour récupérer la catégorie.' };
        }

        const jwt = session.accessToken;

        try {
            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryProps)
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { message: response.statusText || 'Erreur de communication avec l\'API.' };
                }
                console.error('Erreur API (catégorie):', response.status, errorData);
                return {
                    success: false,
                    error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de créer la catégorie.'}`
                };
            }

            const category: Category = await response.json();
            return { success: true, data: category };

        } catch (error) {
            console.error('Erreur inattendue (catégorie):', error);
            return { success: false, error: 'Une erreur serveur est survenue lors de la création de la catégorie.' };
        }
}

/**
 * Action pour révalider manuellement le cache des catégories.
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
