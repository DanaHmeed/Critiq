import { api } from './client'
import type { User } from './types'

export const userApi = {
  reviewers: () => api.get<{ reviewers: User[] }>('/users/reviewers'),

  updateMe: (body: { name?: string; bio?: string }) =>
    api.patch<{ user: User }>('/users/me', body),
}
