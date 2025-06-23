'use server'

import { auth } from '@/auth'

const API_BASE_URL = process.env.API_URL

export async function getNotifications (limit = 0, page = 1, showOnlyUnread: boolean) {
    const session = await auth()

    if (!session?.user?.id || !session?.accessToken) {
        return { success: false, error: 'Non autorisé : Session utilisateur ou token JWT manquant.' }
    }

    const jwt = session.accessToken

    const params = new URLSearchParams()
    if (limit > 0) params.append('limit', limit.toString())
    if (page > 0) params.append('page', page.toString())
    if (showOnlyUnread) params.append('isRead', showOnlyUnread.toString())

    const url = `${API_BASE_URL}/notifications${params.size ? `?${params.toString()}` : ''}`

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            let errorData
            try {
                errorData = await response.json()
            } catch (e) {
                errorData = { message: response.statusText || "Erreur de communication avec l'API." }
            }
            console.error('Erreur API (notifications):', response.status, errorData)
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de récupérer les notifications.'}`,
            }
        }

        const notifications = await response.json()
        return { success: true, data: notifications }
    } catch (error) {
        console.error('Erreur inattendue (notifications):', error)
        return { success: false, error: 'Une erreur serveur est survenue lors de la récupération des notifications.' }
    }
}

export async function markAsReadNotifications (ids: string[]) {
    const session = await auth()

    if (!session?.user?.id || !session?.accessToken) {
        return { success: false, error: 'Non autorisé : Session utilisateur ou token JWT manquant.' }
    }

    const jwt = session.accessToken

    const url = `${API_BASE_URL}/notifications`

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids }),
        })

        if (!response.ok) {
            let errorData
            try {
                errorData = await response.json()
            } catch (e) {
                errorData = { message: response.statusText || "Erreur de communication avec l'API." }
            }
            console.error('Erreur API (notifications):', response.status, errorData)
            return {
                success: false,
                error: `Erreur API (${response.status}): ${errorData.message || 'Impossible de mettre en read les notifications.'}`,
            }
        }

        const notifications = await response.json()
        return { success: true, data: notifications }
    } catch (error) {
        console.error('Erreur inattendue (notifications):', error)
        return { success: false, error: 'Une erreur serveur est survenue lors du marquage en read des notifications.' }
    }
}