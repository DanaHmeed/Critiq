import { api } from './client'
import type { ReviewComment } from './types'

export const commentApi = {
  add: (body: { request_id: string; line_number: number; text: string }) =>
    api.post<{ comment: ReviewComment }>('/comments', body),

  list: (request_id: string) =>
    api.get<{ comments: ReviewComment[] }>('/comments', { request_id }),
}
