import { api } from './client'
import type { User } from './types'

interface AuthResponse {
  token: string
  user: User
}

export const authApi = {
  login: (body: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', body),

  register: (body: { name: string; email: string; password: string; role: string }) =>
    api.post<AuthResponse>('/auth/register', body),

  me: () => api.get<{ user: User }>('/auth/me'),
}
