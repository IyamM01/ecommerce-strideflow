<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Mail, Lock, ArrowRight } from '@lucide/vue'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import type { LoginPayload } from '@/types/auth'
import { isAxiosError } from 'axios'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref<LoginPayload>({
  email: '',
  password: '',
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const user = await authStore.login(form.value)

    const redirectPath = typeof route.query.redirect === 'string'
      ? route.query.redirect
      : authService.getRedirectPath(user.role)
    router.push(redirectPath)
  } catch (err: unknown) {
    console.error('Login failed:', err)
    if (isAxiosError(err) && err.response?.status === 401) {
      errorMessage.value = 'Invalid email or password.'
    } else {
      errorMessage.value = 'An error occurred. Please try again later.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
    class="w-full max-w-[440px] bg-white shadow-2xl rounded-2xl p-10 md:p-12 relative overflow-hidden border border-slate-200"
  >
    <!-- Subtle Top Accent -->
    <div class="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

    <!-- Header -->
    <div class="mb-10 text-center">
      <RouterLink to="/">
        <h1 class="font-lexend text-4xl font-bold text-primary mb-2 tracking-tighter">
          StrideFlow
        </h1>
      </RouterLink>
      <p class="font-inter text-sm text-secondary font-medium">Sign in to continue</p>
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium animate-shake"
    >
      {{ errorMessage }}
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Email Input -->
      <div class="space-y-2">
        <label class="font-inter text-xs font-bold text-secondary uppercase tracking-widest block" for="email"
          >Email</label
        >
        <div class="relative group">
          <span
            class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-primary transition-colors"
          >
            <Mail class="h-5 w-5" />
          </span>
          <input
            v-model="form.email"
            class="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-inter text-sm text-primary placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white focus:outline-none transition-all"
            id="email"
            type="email"
            placeholder="name@company.com"
            required
            :disabled="isLoading"
          />
        </div>
      </div>

      <!-- Password Input -->
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <label class="font-inter text-xs font-bold text-secondary uppercase tracking-widest block" for="password"
            >Password</label
          >
          <a class="font-inter text-xs font-semibold text-primary hover:text-primary/80 transition-colors" href="#"
            >Forgot?</a
          >
        </div>
        <div class="relative group">
          <span
            class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-primary transition-colors"
          >
            <Lock class="h-5 w-5" />
          </span>
          <input
            v-model="form.password"
            class="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-inter text-sm text-primary placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white focus:outline-none transition-all"
            id="password"
            type="password"
            placeholder="••••••••"
            required
            :disabled="isLoading"
          />
        </div>
      </div>

      <!-- Remember Me -->
      <div class="flex items-center">
        <input
          class="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all"
          id="remember-me"
          type="checkbox"
          :disabled="isLoading"
        />
        <label class="ml-3 font-inter text-sm text-secondary font-medium cursor-pointer select-none" for="remember-me"
          >Remember me</label
        >
      </div>

      <!-- Submit Button -->
      <div class="pt-4">
        <button
          class="w-full bg-primary text-white font-inter text-sm font-bold py-4 px-4 rounded-xl hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Signing in...</span>
          <template v-else>
            Sign In
            <ArrowRight class="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </template>
        </button>
      </div>
    </form>

    <!-- Footer Link -->
    <div class="mt-10 text-center border-t border-slate-100 pt-8">
      <p class="font-inter text-sm text-secondary font-medium">
        Don't have an account?
        <RouterLink to="/auth/register" class="text-primary font-bold hover:underline underline-offset-4"
          >Register</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
.animate-shake {
  animation: shake 0.2s ease-in-out 0s 2;
}
</style>
