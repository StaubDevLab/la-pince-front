'use server'

import { auth } from '@/auth'
import { ApiResponse } from '@/types/apiResponse';
import { Notification } from '@/types/notifications';
import { fetchWithAuth } from '@/lib/fetch-with-auth';
const API_BASE_URL = process.env.API_URL

export async function getNotifications (limit = 0, page = 1, showOnlyUnread = true): Promise<ApiResponse<{ data: Notification[]; limit: number; page: number; total: number }>> {
    const { data: res, error, success } = await fetchWithAuth<{ data: Notification[]; limit: number; page: number; total: number }>(
        `${API_BASE_URL}/notifications`,
        {
          method: 'GET',
          next: {
            revalidate: 300,
            tags: ['notifications'],
          },
        }
      )

      if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
      }
    
      return { success: true, data: res }
}

export async function markAsReadNotifications (ids: string[]) {
    const { data: res, error, success } = await fetchWithAuth<{ data: Notification[]; limit: number; page: number; total: number }>(
        `${API_BASE_URL}/notifications`,
        {
          method: 'PATCH',
          body: JSON.stringify({ ids }),
          next: {
            revalidate: 300,
            tags: ['notifications'],
          },
        }
      )

      if (!success || !res) {
        return { success: false, error: error || 'Erreur inconnue' }
      }
    
      return { success: true, data: res }

}