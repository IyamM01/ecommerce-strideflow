export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role?: string
  created_at?: string
  updated_at?: string
}

export interface UserCollectionResponse {
  success: boolean
  message: string
  data: User[]
}

export interface UserPayload {
  name: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
  password?: string
  password_confirmation?: string
}
