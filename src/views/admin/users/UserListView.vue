<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import Sidebar from '@/components/admin/Sidebar.vue'
import { userService } from '@/services/userService'
import type { User } from '@/types/user'

const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)
const users = ref<User[]>([])
const searchQuery = ref('')

const filteredUsers = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  if (!keyword) return users.value

  return users.value.filter((user) =>
    user.name.toLowerCase().includes(keyword) ||
    user.email.toLowerCase().includes(keyword) ||
    (user.role || '').toLowerCase().includes(keyword),
  )
})

const formatDate = (value?: string) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', { dateStyle: 'medium' })
}

const fetchUsers = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await userService.getAll()
    users.value = response.data ?? []
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Gagal mengambil data user'
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Yakin ingin menghapus user ini?')) return

  try {
    await userService.delete(id)
    users.value = users.value.filter((user) => user.id !== id)
  } catch (err: any) {
    alert(err.response?.data?.message || 'Gagal menghapus user')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="bg-background text-on-background font-inter min-h-screen flex">
    <Sidebar />

    <main class="flex-1 md:ml-64 p-margin">
      <header class="mb-margin flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-on-background">Users</h1>
          <p class="text-on-surface-variant">Kelola akun customer dan admin dari dashboard.</p>
        </div>

        <button
          @click="router.push('/admin/users/create')"
          class="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <span class="material-symbols-outlined">person_add</span>
          Add New User
        </button>
      </header>

      <div v-if="error" class="mb-6 rounded-2xl border border-error/20 bg-error-container px-5 py-4 text-sm text-on-error-container">
        {{ error }}
      </div>

      <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-high overflow-hidden">
        <div class="p-6 border-b border-surface-container-high">
          <div class="relative max-w-md">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users by name, email, or role..."
              class="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low/50 text-on-surface-variant text-[11px] font-bold uppercase tracking-widest border-b border-surface-container-high">
                <th class="p-5 pl-8">User</th>
                <th class="p-5">Phone</th>
                <th class="p-5">Role</th>
                <th class="p-5">Joined</th>
                <th class="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-surface-container-high">
              <tr v-if="loading">
                <td colspan="5" class="p-8 text-center text-on-surface-variant">Loading users...</td>
              </tr>

              <tr
                v-for="user in filteredUsers"
                :key="user.id"
                class="hover:bg-surface-container-low transition-colors group"
              >
                <td class="p-5 pl-8">
                  <div class="flex items-center gap-4">
                    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                      {{ user.name?.slice(0, 1).toUpperCase() }}
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="font-bold text-on-background truncate">{{ user.name }}</span>
                      <span class="text-xs text-on-surface-variant">{{ user.email }}</span>
                    </div>
                  </div>
                </td>

                <td class="p-5 text-on-surface">{{ user.phone || '-' }}</td>

                <td class="p-5">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                    :class="user.role === 'admin' ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface'"
                  >
                    {{ user.role || 'customer' }}
                  </span>
                </td>

                <td class="p-5 text-on-surface-variant">{{ formatDate(user.created_at) }}</td>

                <td class="p-5 pr-8">
                  <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      @click="router.push(`/admin/users/${user.id}/edit`)"
                      class="p-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-white transition-all"
                      title="Edit User"
                    >
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      @click="handleDelete(user.id)"
                      class="p-2 rounded-lg bg-surface-container-high text-error hover:bg-error hover:text-white transition-all"
                      title="Delete User"
                    >
                      <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!loading && filteredUsers.length === 0">
                <td colspan="5" class="p-20 text-center text-on-surface-variant">
                  Tidak ada user yang cocok dengan pencarian.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>
