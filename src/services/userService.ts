import api from './api'
import type { User } from '@/types/user'
import type { UserCollectionResponse, UserPayload } from '@/types/user'

interface UserProfilePayload {
  name: string
  email: string
  phone?: string
}

const unwrapUser = (payload: unknown): User => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: User }).data
  }

  return payload as User
}

export const userService = {
  async getAll(): Promise<UserCollectionResponse> {
    const response = await api.get<UserCollectionResponse>('/users')
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/me')
    return unwrapUser(response.data)
  },

  async getById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`)
    return unwrapUser(response.data)
  },

  async create(payload: UserPayload): Promise<User> {
    const response = await api.post('/users', payload)
    return unwrapUser(response.data)
  },

  async updateProfile(id: number, payload: UserProfilePayload): Promise<User> {
    const response = await api.put(`/users/${id}`, payload)
    return unwrapUser(response.data)
  },

  async update(id: number, payload: UserPayload): Promise<User> {
    const response = await api.put(`/users/${id}`, payload)
    return unwrapUser(response.data)
  },

  async delete(id: number) {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
}
