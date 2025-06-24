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
      } catch {}

      if (isUnauthorized) {
        console.warn('Token invalide ou expiré, redirection...')
        redirect('/connexion') 
      }

      return { success: false, error: errorMessage, status: response.status }
    }

    const json = await response.json()
    return { success: true, data: json }
  } catch (err) {
    console.error('Erreur réseau', err)
    return { success: false, error: 'Erreur de réseau ou serveur.' }
  }
}
