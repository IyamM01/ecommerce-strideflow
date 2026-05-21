<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { CircleUser, Heart, LogOut, Menu, ShieldCheck, ShoppingCart, X } from '@lucide/vue'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

const isOpen = ref(false)

const navItems = [
  { label: 'Shop', to: '/shop' },
  { label: 'Men', to: '/men' },
  { label: 'Woman', to: '/woman' },
  { label: 'Kids', to: '/kids' },
]

const accountLabel = computed(() => authStore.user?.name?.split(' ')[0] ?? 'Profile')

const handleLogout = async () => {
  await authStore.logout()
  isOpen.value = false
  router.push('/auth/login')
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
    <nav class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
      <RouterLink to="/" class="inline-flex items-center" aria-label="StrideFlow home">
        <img src="/src/assets/logo.webp" alt="StrideFlow" class="h-14 w-auto object-contain" />
      </RouterLink>

      <ul class="hidden items-center gap-10 md:flex">
        <li v-for="item in navItems" :key="item.to">
          <RouterLink
            :to="item.to"
            class="relative text-[15px] font-semibold text-secondary transition hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            active-class="text-primary after:w-full"
          >
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>

      <div class="flex items-center justify-end gap-3 sm:gap-5">
        <button
          class="hidden h-10 w-10 items-center justify-center rounded-lg text-primary transition hover:bg-slate-100 md:flex"
          type="button"
          aria-label="Wishlist"
        >
          <Heart class="h-5 w-5" stroke-width="2" />
        </button>

        <RouterLink
          to="/cart"
          class="relative flex h-10 w-10 items-center justify-center rounded-lg text-primary transition hover:bg-slate-100"
          aria-label="Shopping cart"
        >
          <ShoppingCart class="h-5 w-5" stroke-width="2" />

          <span
            v-if="cartStore.totalItems > 0"
            class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[10px] font-bold leading-none text-white"
          >
            {{ cartStore.totalItems }}
          </span>
        </RouterLink>

        <RouterLink
          v-if="!authStore.isLoggedIn"
          to="/auth/login"
          class="hidden rounded-lg px-3 py-2 text-[15px] font-semibold text-secondary transition hover:bg-slate-100 hover:text-primary md:inline-flex"
        >
          Login
        </RouterLink>

        <div v-else class="hidden items-center gap-2 md:flex">
          <RouterLink
            v-if="authStore.user?.role === 'admin'"
            to="/admin"
            class="flex h-10 w-10 items-center justify-center rounded-lg text-primary transition hover:bg-slate-100"
            aria-label="Admin dashboard"
          >
            <ShieldCheck class="h-5 w-5" stroke-width="2" />
          </RouterLink>

          <RouterLink
            to="/profile"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-secondary transition hover:bg-slate-100 hover:text-primary"
          >
            <CircleUser class="h-5 w-5" stroke-width="2" />
            <span class="max-w-24 truncate">{{ accountLabel }}</span>
          </RouterLink>

          <button
            class="flex h-10 w-10 items-center justify-center rounded-lg text-secondary transition hover:bg-red-50 hover:text-red-600"
            type="button"
            title="Logout"
            @click="handleLogout"
          >
            <LogOut class="h-5 w-5" stroke-width="2" />
          </button>
        </div>

        <button
          class="flex h-10 w-10 items-center justify-center rounded-lg text-primary transition hover:bg-slate-100 md:hidden"
          type="button"
          aria-label="Toggle menu"
          :aria-expanded="isOpen"
          @click="isOpen = !isOpen"
        >
          <X v-if="isOpen" class="h-6 w-6" />
          <Menu v-else class="h-6 w-6" />
        </button>
      </div>
    </nav>

    <div v-if="isOpen" class="border-t border-slate-200 bg-white px-6 py-5 md:hidden">
      <ul class="space-y-2">
        <li v-for="item in navItems" :key="item.to">
          <RouterLink
            :to="item.to"
            class="block rounded-lg px-3 py-3 text-base font-semibold text-secondary hover:bg-slate-100 hover:text-primary"
            @click="isOpen = false"
          >
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>

      <div class="mt-5 border-t border-slate-100 pt-5">
        <RouterLink
          v-if="!authStore.isLoggedIn"
          to="/auth/login"
          class="block rounded-lg px-3 py-3 text-base font-semibold text-secondary hover:bg-slate-100 hover:text-primary"
          @click="isOpen = false"
        >
          Login
        </RouterLink>

        <div v-else class="grid gap-2">
          <RouterLink
            to="/profile"
            class="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-secondary hover:bg-slate-100 hover:text-primary"
            @click="isOpen = false"
          >
            <CircleUser class="h-5 w-5" stroke-width="2" />
            {{ accountLabel }}
          </RouterLink>

          <RouterLink
            v-if="authStore.user?.role === 'admin'"
            to="/admin"
            class="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-semibold text-secondary hover:bg-slate-100 hover:text-primary"
            @click="isOpen = false"
          >
            <ShieldCheck class="h-5 w-5" stroke-width="2" />
            Admin
          </RouterLink>

          <button
            class="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-base font-semibold text-red-600 hover:bg-red-50"
            type="button"
            @click="handleLogout"
          >
            <LogOut class="h-5 w-5" stroke-width="2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
