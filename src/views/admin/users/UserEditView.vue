<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Sidebar from '@/components/admin/Sidebar.vue'
import UserForm from '@/components/admin/UserForm.vue'
import { userService } from '@/services/userService'
import type { AdminUserFormValues } from '@/types/adminUserForm'
import type { User, UserPayload } from '@/types/user'
import { getApiErrorMessage } from '@/utils/apiResponse'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref<string | null>(null)
const user = ref<User | null>(null)
const userId = computed(() => Number(route.params.id))

const normalizeRole = (role?: string): AdminUserFormValues['role'] => {
  return role === 'admin' ? 'admin' : 'customer'
}

const initialValues = computed<Partial<AdminUserFormValues>>(() => {
  if (!user.value) return {}

  return {
    name: user.value.name,
    email: user.value.email,
    phone: user.value.phone ?? '',
    role: normalizeRole(user.value.role),
  }
})

const loadUser = async () => {
  if (Number.isNaN(userId.value)) {
    await router.push('/admin/users')
    return
  }

  loading.value = true
  error.value = null

  try {
    user.value = await userService.getById(userId.value)
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Gagal mengambil detail user')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async (payload: UserPayload) => {
  if (Number.isNaN(userId.value)) return

  loading.value = true
  error.value = null

  const nextPayload: UserPayload = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
  }

  if (payload.password) {
    nextPayload.password = payload.password
    nextPayload.password_confirmation = payload.password_confirmation
  }

  try {
    await userService.update(userId.value, nextPayload)
    await router.push('/admin/users')
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Gagal mengupdate user')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUser()
})
</script>

<template>
  <div class="bg-background text-on-background font-inter min-h-screen flex">
    <Sidebar />

    <main class="flex-1 md:ml-64 p-margin">
      <div
        v-if="loading && !user"
        class="rounded-3xl border border-surface-container-high bg-surface-container-lowest p-10 text-center text-on-surface-variant"
      >
        Memuat detail user...
      </div>

      <UserForm
        v-else
        title="Edit User"
        description="Perbarui detail akun user dari admin dashboard."
        submit-label="Update User"
        :loading="loading"
        :error="error"
        :initial-values="initialValues"
        :require-password="false"
        @submit="handleSubmit"
        @cancel="router.push('/admin/users')"
      />
    </main>
  </div>
</template>
