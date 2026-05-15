import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/services/authService'
import type { User } from '@/types/user'
import type { LoginPayload, RegisterPayload } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref<string | null>(localStorage.getItem('token'))

  // Helper to set session
  function setAuth(userData: User, userToken: string) {
    isLoggedIn.value = true
    user.value = userData
    token.value = userToken

    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)
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
      isLoggedIn.value = false
      user.value = null
      token.value = null
    }
  }

  return { isLoggedIn, user, token, login, register, logout, syncUser }
})
