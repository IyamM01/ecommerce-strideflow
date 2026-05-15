<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ShoppingCart, CircleUser, Search, Heart, Menu, X, LogOut } from '@lucide/vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const isOpen = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
    <nav class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
      <!-- Logo -->
      <div class="flex w-1/4 items-center">
        <RouterLink to="/" class="inline-flex items-center">
          <img src="/src/assets/logo.webp" alt="Logo" class="h-15 w-auto object-contain" />
        </RouterLink>
      </div>

      <!-- Center: Menu -->
      <div class="hidden flex-1 justify-center md:flex">
        <ul class="flex items-center gap-10">
          <li>
            <RouterLink
              to="/men"
              class="relative text-[15px] font-semibold font-poppins text-secondary transition hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              active-class="text-primary after:w-full"
            >
              Men
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/woman"
              class="relative text-[15px] font-semibold font-poppins text-secondary transition hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              active-class="text-primary after:w-full"
            >
              Woman
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/kids"
              class="relative text-[15px] font-semibold font-poppins text-secondary transition hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              active-class="text-primary after:w-full"
            >
              Kids
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Right: Search & Icons -->
      <div class="flex w-1/4 items-center justify-end gap-6">
        <!-- Search -->
        <div class="hidden lg:block">
          <div class="flex h-10 w-64 items-center rounded-full bg-background px-4">
            <input
              type="text"
              placeholder="Search..."
              class="w-full bg-transparent text-sm text-secondary placeholder:text-quaternary focus:outline-none"
            />
            <Search class="ml-2 h-4 w-4 text-quaternary" />
          </div>
        </div>

        <!-- Wishlist -->
        <a
          href="#"
          class="relative flex items-center text-primary transition hover:opacity-80 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
        >
          <Heart class="h-5 w-5" stroke-width="2" />
        </a>

        <!-- Cart -->
        <RouterLink
          to="/cart"
          class="relative flex items-center text-primary transition hover:opacity-80 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
        >
          <ShoppingCart class="h-5 w-5" stroke-width="2" />

          <span
            v-if="cartStore.totalItems > 0"
            class="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[10px] font-bold leading-none text-white"
          >
            {{ cartStore.totalItems }}
          </span>
        </RouterLink>

        <!-- Account -->
        <RouterLink
          v-if="!authStore.isLoggedIn"
          to="/auth/login"
          class="relative flex items-center text-[15px] font-semibold font-poppins text-secondary transition hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
        >
          Login
        </RouterLink>

        <div v-else class="flex items-center gap-4">
          <RouterLink
            to="/profile"
            class="relative flex items-center text-primary transition hover:opacity-80"
          >
            <CircleUser class="h-5 w-5" stroke-width="2" />
          </RouterLink>

          <button
            @click="handleLogout"
            class="text-secondary hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut class="h-5 w-5" stroke-width="2" />
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button class="md:hidden text-primary" type="button" @click="isOpen = !isOpen">
          <X v-if="isOpen" class="h-6 w-6" />
          <Menu v-else class="h-6 w-6" />
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="isOpen" class="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
      <ul class="space-y-4">
        <li>
          <RouterLink
            to="/men"
            class="block text-base font-semibold text-secondary hover:text-primary"
            @click="isOpen = false"
          >
            Men
          </RouterLink>
        </li>

        <li>
          <RouterLink
            to="/woman"
            class="block text-base font-semibold text-secondary hover:text-primary"
            @click="isOpen = false"
          >
            Woman
          </RouterLink>
        </li>

        <li>
          <RouterLink
            to="/kids"
            class="block text-base font-semibold text-secondary hover:text-primary"
            @click="isOpen = false"
          >
            Kids
          </RouterLink>
        </li>
      </ul>

      <div class="mt-5">
        <div class="flex h-10 items-center rounded-full bg-background px-4">
          <input
            type="text"
            placeholder="Search..."
            class="w-full bg-transparent text-sm text-secondary placeholder:text-quaternary focus:outline-none"
          />
          <Search class="ml-2 h-4 w-4 text-quaternary" />
        </div>
      </div>
    </div>
  </header>
</template>
