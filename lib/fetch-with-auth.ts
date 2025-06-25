'use server'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function fetchWithAuth<T>(
  input: RequestInfo,
  init?: RequestInit & { next?: { tags?: string[], revalidate?: number } }
): Promise<{ data?: T; error?: string; success: boolean; status?: number }> {
 
    const session = await auth()
  if (!session?.accessToken) {
    console.warn('Aucun token disponible, redirection en cours...')
    redirect('/connexion')
  }

  const token = session.accessToken

  try {
    const response = await fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const isUnauthorized = response.status === 401 || response.status === 403

      let errorMessage = 'Erreur inconnue'
      try {
        const json = await response.json()
        errorMessage = json.message || response.statusText
      } catch  {
        errorMessage = response.statusText || `Erreur HTTP ${response.status}`
      }

      if (isUnauthorized) {
        console.warn('Token invalide ou expiré, redirection...')
        redirect('/connexion')
      }

      return { success: false, error: errorMessage, status: response.status }
    }

    const contentLength = response.headers.get('Content-Length');
    const contentType = response.headers.get('content-type');
    if (response.status === 204 || contentLength === '0' || (contentType && !contentType.includes('application/json'))) {
        return { success: true, data: undefined, status: response.status };
    }

    try {
        const json = await response.json();
        return { success: true, data: json, status: response.status };
    } catch (err) {
        console.warn('Erreur de parsing JSON pour une réponse réussie:', err);
        return { success: true, data: undefined, status: response.status };
    }

  } catch (err) {
    console.error('Erreur réseau ou traitement de la réponse:', err)
    return { success: false, error: 'Erreur de réseau ou de traitement de la réponse.', status: 500 }
  }
}