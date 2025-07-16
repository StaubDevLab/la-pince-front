'use server';

import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';
import { ApiResponse } from '@/types/apiResponse';
import { Category } from '@/types/categories';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
const API_BASE_URL = process.env.API_URL;

/**
 * Méthodes pour récupérer les catégories depuis l'API.
 * 
 */
export async function fetchCategories(): Promise<ApiResponse<Category[]>> {
    const { data: res, error, success } = await fetchWithAuth<Category[]>(
        `${API_BASE_URL}/categories`,
        {
          method: 'GET',
          next: {
            revalidate: 3600,
            tags: ['categories'],
          },
        }
      )

      if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
      }
    
      return { success: true, data: res }
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
   const { data: res, error, success } = await fetchWithAuth<Category>(
        `${API_BASE_URL}/categories/${id}`,
        {
          method: 'GET',
          next: {
            revalidate: 3600,
            tags: [`categories`, `category-${id}`], 
          },
        }
      )

      if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
      }
    
      return { success: true, data: res }
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
            revalidateTag('categories');
            return { success: true, data: category };

        } catch (error) {
            console.error('Erreur inattendue (catégorie):', error);
            return { success: false, error: 'Une erreur serveur est survenue lors de la création de la catégorie.' };
        }
}

export async function updateCategory(
    categoryProps: Pick<Category, 'id' | 'color' | 'icon' | 'name'>
) {
    const session = await auth();

    if (!session?.accessToken) {
        return { success: false, error: 'Non autorisé : Token JWT manquant pour mettre à jour la catégorie.' };
    }

    const jwt = session.accessToken;

    try {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryProps.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: categoryProps.name,
                color: categoryProps.color,
                icon: categoryProps.icon
            }),
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: response.statusText || 'Erreur de communication avec l\'API.' };
            }
            console.error('Erreur API (update catégorie):', response.status, errorData);
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de mettre à jour la catégorie.'}`
            };
        }

        const updatedCategory: Category = await response.json();
        revalidateTag('categories'); // Ajout ici
        revalidateTag(`category-${categoryProps.id}`);
        return { success: true, data: updatedCategory };

    } catch (error) {
        console.error('Erreur inattendue (update catégorie):', error);
        return { success: false, error: 'Une erreur serveur est survenue lors de la mise à jour de la catégorie.' };
    }
}

export async function deleteCategory(id: string) {
    const session = await auth();

    if (!session?.accessToken) {
        return {
            success: false,
            error: 'Non autorisé : Token JWT manquant pour supprimer la catégorie.',
        };
    }

    const jwt = session.accessToken;

    try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: response.statusText || 'Erreur de communication avec l\'API.' };
            }
            console.error('Erreur API (delete catégorie):', response.status, errorData);
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de supprimer la catégorie.'}`
            };
        }

        revalidateTag('categories'); // Ajout ici
        return { success: true };

    } catch (error) {
        console.error('Erreur inattendue (delete catégorie):', error);
        return {
            success: false,
            error: 'Une erreur serveur est survenue lors de la suppression de la catégorie.',
        };
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
