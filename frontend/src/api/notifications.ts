import { api } from './client'
import type { Notification } from './types'

export const notificationApi = {
  list: () => api.get<{ notifications: Notification[]; unread_count: number }>('/notifs'),

  markRead: (id: string) =>
    api.patch<{ notification: Notification }>(`/notifs/${id}/read`, {}),

  markAllRead: () =>
    api.patch<{ message: string }>('/notifs/read-all', {}),
}
