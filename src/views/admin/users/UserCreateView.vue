<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import Sidebar from '@/components/admin/Sidebar.vue'
import UserForm from '@/components/admin/UserForm.vue'
import { userService } from '@/services/userService'
import type { UserPayload } from '@/types/user'
import { getApiErrorMessage } from '@/utils/apiResponse'

const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async (payload: UserPayload) => {
  loading.value = true
  error.value = null

  try {
    await userService.create(payload)
    await router.push('/admin/users')
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Gagal menambahkan user')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-background text-on-background font-inter min-h-screen flex">
    <Sidebar />

    <main class="flex-1 md:ml-64 p-margin">
      <UserForm
        title="Tambah User"
        description="Buat akun baru untuk customer atau admin."
        submit-label="Simpan User"
        :loading="loading"
        :error="error"
        @submit="handleSubmit"
        @cancel="router.push('/admin/users')"
      />
    </main>
  </div>
</template>
