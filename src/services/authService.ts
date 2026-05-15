import api from './api'
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth'
import type { User } from '@/types/user'

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', payload)
    return response.data
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/register', payload)
    return response.data
  },

  async logout() {
    try {
      await api.post('/logout')
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isLoggedIn')
    }
  },

  async me(): Promise<User> {
    const response = await api.get<User>('/me')
    return response.data
  },

  getRedirectPath(role?: string): string {
    return role === 'admin' ? '/admin' : '/'
  }
}
