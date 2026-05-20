<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'AdminSidebar',
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isDashboardRoute = computed(() => route.path === '/admin')
const isOrderRoute = computed(() => route.path.startsWith('/admin/orders'))
const isProductRoute = computed(() => route.path.startsWith('/admin/products'))
const isUserRoute = computed(() => route.path.startsWith('/admin/users'))

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <aside
    class="h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant shadow-xl hidden md:flex flex-col p-4 gap-2 z-50"
  >
    <div class="mb-8 px-4 py-2">
      <h1 class="text-xl font-bold text-primary-container">StrideFlow</h1>
      <p class="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mt-1">
        Management Portal
      </p>
    </div>

    <nav class="flex-1 flex flex-col gap-2">
      <RouterLink to="/admin" class="menu-link" :class="{ 'menu-link-active': isDashboardRoute }">
        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">
          dashboard
        </span>
        <span class="text-sm">Dashboard</span>
      </RouterLink>

      <RouterLink
        to="/admin/orders"
        class="menu-link"
        :class="{ 'menu-link-active': isOrderRoute }"
      >
        <span class="material-symbols-outlined">receipt_long</span>
        <span class="text-sm">Orders</span>
      </RouterLink>

      <RouterLink
        to="/admin/products"
        class="menu-link"
        :class="{ 'menu-link-active': isProductRoute }"
      >
        <span class="material-symbols-outlined">inventory_2</span>
        <span class="text-sm">Products</span>
      </RouterLink>

      <RouterLink to="/admin/users" class="menu-link" :class="{ 'menu-link-active': isUserRoute }">
        <span class="material-symbols-outlined">person_outline</span>
        <span class="text-sm">Users</span>
      </RouterLink>

      <a class="menu-link" href="#">
        <span class="material-symbols-outlined">settings</span>
        <span class="text-sm">Settings</span>
      </a>
    </nav>

    <div class="mt-auto pt-4 border-t border-outline-variant">
      <div class="flex items-center gap-3 px-2 mb-4">
        <div
          class="w-10 h-10 rounded-full border border-outline-variant bg-primary-container text-white flex items-center justify-center font-bold"
        >
          {{ authStore.user?.name?.[0] }}
        </div>

        <div class="flex flex-col min-w-0">
          <span class="text-sm font-semibold text-on-background truncate">
            {{ authStore.user?.name }}
          </span>
          <span class="text-xs text-on-surface-variant truncate">
            {{ authStore.user?.email }}
          </span>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-2 text-error hover:bg-error-container rounded-lg transition-all text-sm font-bold"
      >
        <span class="material-symbols-outlined">logout</span>
        Logout
      </button>
    </div>
  </aside>
</template>

<style scoped>
.menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--color-on-surface-variant);
  border-radius: 8px;
  transition: all 0.2s;
  text-decoration: none;
}

.menu-link:hover {
  background-color: var(--color-surface-container-low);
}

.menu-link-active {
  background-color: var(--color-surface-container-high);
  color: var(--color-primary-container);
  font-weight: 700;
}
</style>
