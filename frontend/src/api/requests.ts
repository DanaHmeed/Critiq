import { api } from './client'
import type { ReviewComment, ReviewRequest, RequestStatus, Urgency } from './types'

export interface CreateRequestBody {
  title: string
  description?: string
  language: string
  code: string
  urgency?: Urgency
  reviewer_id?: string | null
}

export const requestApi = {
  list: (params?: { status?: RequestStatus | 'all'; language?: string; page?: number; limit?: number }) =>
    api.get<{ requests: ReviewRequest[]; page: number; limit: number }>('/requests', {
      ...params,
      status: params?.status === 'all' ? undefined : params?.status,
    }),

  mine: () => api.get<{ requests: ReviewRequest[] }>('/requests/mine'),

  get: (id: string) =>
    api.get<{ request: ReviewRequest; comments: ReviewComment[] }>(`/requests/${id}`),

  create: (body: CreateRequestBody) =>
    api.post<{ request: ReviewRequest }>('/requests', body),

  updateStatus: (id: string, status: RequestStatus) =>
    api.patch<{ request: ReviewRequest }>(`/requests/${id}/status`, { status }),

  assign: (id: string, reviewer_id: string) =>
    api.patch<{ request: ReviewRequest }>(`/requests/${id}/assign`, { reviewer_id }),
}
