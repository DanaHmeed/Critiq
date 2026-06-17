export type UserRole = 'requester' | 'reviewer' | 'admin' | 'suspended'
export type RequestStatus = 'pending' | 'in-review' | 'completed' | 'rejected'
export type Urgency = 'low' | 'normal' | 'high'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  bio?: string | null
  review_count: number
  created_at: string
}

export interface ReviewRequest {
  id: string
  title: string
  description?: string | null
  language: string
  code: string
  urgency: Urgency
  status: RequestStatus
  author_id: string
  reviewer_id?: string | null
  author_name?: string
  author_email?: string
  reviewer_name?: string | null
  comment_count?: string | number
  created_at: string
  updated_at: string
}

export interface ReviewComment {
  id: string
  request_id: string
  author_id: string
  author_name: string
  line_number: number
  text: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  message: string
  reference_id?: string | null
  is_read: boolean
  created_at: string
}
