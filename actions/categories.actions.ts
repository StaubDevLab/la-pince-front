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
async function fetchCategories(): Promise<ApiResponse<Category[]>> {
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
