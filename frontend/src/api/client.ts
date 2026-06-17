// frontend/src/api/client.ts

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken(): string | null {
  return localStorage.getItem('critiq-token')
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options

  // Build URL with optional query params
  const url = new URL(`${BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v))
    })
  }

  const token = getToken()

  const res = await fetch(url.toString(), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  // Handle no-content responses
  if (res.status === 204) return undefined as T

  const data = await res.json()

  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`
    throw new Error(message)
  }

  return data as T
}

// ── Convenience methods ───────────────────────────────────────────
export const api = {
  get: <T>(endpoint: string, params?: RequestOptions['params']) =>
    request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
}