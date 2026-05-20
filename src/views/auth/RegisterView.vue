<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { CircleUser, Mail, Lock, Smartphone } from '@lucide/vue'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { isAxiosError } from 'axios'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const user = await authStore.register({
      name: fullName.value,
      email: email.value,
      phone: '',
      password: password.value,
      password_confirmation: confirmPassword.value,
    })

    const redirectPath =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : authService.getRedirectPath(user.role)
    router.push(redirectPath)
  } catch (err: unknown) {
    console.error('Registration failed:', err)
    if (isAxiosError(err) && err.response?.data?.message) {
      errorMessage.value = err.response.data.message
    } else {
      errorMessage.value = 'An error occurred during registration.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
    class="w-full max-w-[480px] bg-white shadow-2xl rounded-2xl p-10 md:p-12 relative overflow-hidden border border-slate-200"
  >
    <!-- Header -->
    <header class="mb-10 text-center">
      <RouterLink to="/">
        <div class="font-lexend text-2xl text-primary tracking-widest mb-6 font-bold uppercase">
          StrideFlow
        </div>
      </RouterLink>
      <h1 class="font-lexend text-3xl font-bold text-primary mb-3">Create Account</h1>
      <p class="font-inter text-sm text-secondary font-medium">
        Join the platform of unhurried precision.
      </p>
    </header>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium animate-shake"
    >
      {{ errorMessage }}
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Full Name Input -->
      <div class="space-y-1.5">
        <label
          class="block font-inter text-xs font-bold text-secondary uppercase tracking-widest"
          for="fullName"
          >Full Name</label
        >
        <div class="relative group">
          <span
            class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
          >
            <CircleUser class="h-5 w-5" />
          </span>
          <input
            v-model="fullName"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 font-inter text-sm text-primary placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all"
            id="fullName"
            placeholder="Jane Doe"
            type="text"
            required
            :disabled="isLoading"
          />
        </div>
      </div>

      <!-- Email Input -->
      <div class="space-y-1.5">
        <label
          class="block font-inter text-xs font-bold text-secondary uppercase tracking-widest"
          for="email"
          >Email Address</label
        >
        <div class="relative group">
          <span
            class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
          >
            <Mail class="h-5 w-5" />
          </span>
          <input
            v-model="email"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 font-inter text-sm text-primary placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all"
            id="email"
            placeholder="jane@example.com"
            type="email"
            required
            :disabled="isLoading"
          />
        </div>
      </div>

      <!-- Password Input -->
      <div class="space-y-1.5">
        <label
          class="block font-inter text-xs font-bold text-secondary uppercase tracking-widest"
          for="password"
          >Password</label
        >
        <div class="relative group">
          <span
            class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
          >
            <Lock class="h-5 w-5" />
          </span>
          <input
            v-model="password"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 font-inter text-sm text-primary placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all"
            id="password"
            placeholder="••••••••"
            type="password"
            required
            :disabled="isLoading"
          />
        </div>
      </div>

      <!-- Confirm Password Input -->
      <div class="space-y-1.5">
        <label
          class="block font-inter text-xs font-bold text-secondary uppercase tracking-widest"
          for="confirmPassword"
          >Confirm Password</label
        >
        <div class="relative group">
          <span
            class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
          >
            <Lock class="h-5 w-5" />
          </span>
          <input
            v-model="confirmPassword"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 font-inter text-sm text-primary placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all"
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            required
            :disabled="isLoading"
          />
        </div>
      </div>

      <!-- Primary Action -->
      <button
        class="w-full bg-primary text-white font-inter text-xs font-bold py-4 px-6 rounded-xl uppercase tracking-widest hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
        type="submit"
        :disabled="isLoading"
      >
        <span v-if="isLoading">Creating Account...</span>
        <span v-else>Create Account</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="flex items-center my-8">
      <div class="grow border-t border-slate-100"></div>
      <span class="px-4 font-inter text-xs font-bold text-slate-400 uppercase tracking-widest"
        >or</span
      >
      <div class="grow border-t border-slate-100"></div>
    </div>

    <!-- Social Logins -->
    <div class="grid grid-cols-2 gap-4">
      <button
        class="flex items-center justify-center gap-2 w-full border border-slate-200 text-primary bg-white font-inter text-xs font-bold py-3.5 px-4 rounded-xl uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all"
        type="button"
        :disabled="isLoading"
      >
        <img src="/src/assets/google.png" alt="Google" class="h-5 w-5" />
        Google
      </button>
      <button
        class="flex items-center justify-center gap-2 w-full border border-slate-200 text-primary bg-white font-inter text-xs font-bold py-3.5 px-4 rounded-xl uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all"
        type="button"
        :disabled="isLoading"
      >
        <Smartphone class="h-[18px] w-[18px]" />
        Apple
      </button>
    </div>

    <!-- Footer Link -->
    <div class="mt-10 text-center border-t border-slate-100 pt-8">
      <p class="font-inter text-sm text-secondary font-medium">
        Already have an account?
        <RouterLink
          to="/auth/login"
          class="text-primary font-bold hover:underline underline-offset-4 ml-1"
          >Log in</RouterLink
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
