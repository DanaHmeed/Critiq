import { api } from './client'
import type { ReviewRequest, User, UserRole } from './types'

export interface AdminStats {
  total_users: number
  total_requests: number
  total_comments: number
  pending: number
  in_review: number
  completed: number
}

export const adminApi = {
  stats: () => api.get<{ stats: AdminStats }>('/admin/stats'),

  users: () => api.get<{ users: User[]; total: number; page: number; limit: number }>('/admin/users'),

  requests: () =>
    api.get<{ requests: ReviewRequest[]; total: number; page: number; limit: number }>('/admin/requests'),

  updateRole: (id: string, role: UserRole) =>
    api.patch<{ user: User }>(`/admin/users/${id}/role`, { role }),

  suspend: (id: string, suspend: boolean) =>
    api.patch<{ user: User }>(`/admin/users/${id}/suspend`, { suspend }),
}
