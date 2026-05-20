import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/services/authService'
import type { User } from '@/types/user'
import type { LoginPayload, RegisterPayload } from '@/types/auth'

const parseStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null') as User | null
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')
  const user = ref<User | null>(parseStoredUser())
  const token = ref<string | null>(localStorage.getItem('token'))

  function setAuth(userData: User, userToken: string) {
    isLoggedIn.value = true
    user.value = userData
    token.value = userToken

    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)
  }

  function clearAuth() {
    isLoggedIn.value = false
    user.value = null
    token.value = null

    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  function syncUser(userData: User) {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  async function login(credentials: LoginPayload) {
    const response = await authService.login(credentials)
    setAuth(response.user, response.token)
    return response.user
  }

  async function register(data: RegisterPayload) {
    const response = await authService.register(data)
    setAuth(response.user, response.token)
    return response.user
  }

  async function logout() {
    try {
      await authService.logout()
    } finally {
      clearAuth()
    }
  }

  return { isLoggedIn, user, token, clearAuth, login, register, logout, syncUser }
})
