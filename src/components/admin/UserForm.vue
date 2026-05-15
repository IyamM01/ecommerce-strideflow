<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import type { AdminUserFormValues } from '@/types/adminUserForm'
import type { UserPayload } from '@/types/user'

const props = withDefaults(defineProps<{
  title: string
  description: string
  submitLabel: string
  loading?: boolean
  initialValues?: Partial<AdminUserFormValues>
  requirePassword?: boolean
  error?: string | null
}>(), {
  loading: false,
  initialValues: () => ({}),
  requirePassword: true,
  error: null,
})

const emit = defineEmits<{
  submit: [payload: UserPayload]
  cancel: []
}>()

const form = reactive<AdminUserFormValues>({
  name: '',
  email: '',
  phone: '',
  role: 'customer',
  password: '',
  password_confirmation: '',
})

const localError = computed(() => {
  if (!form.name.trim()) return 'Nama user wajib diisi.'
  if (!form.email.trim()) return 'Email user wajib diisi.'
  if (props.requirePassword && !form.password.trim()) return 'Password wajib diisi.'
  if ((props.requirePassword || form.password.trim()) && form.password.length > 0 && form.password.length < 8) {
    return 'Password minimal 8 karakter.'
  }
  if ((props.requirePassword || form.password.trim()) && form.password !== form.password_confirmation) {
    return 'Konfirmasi password tidak cocok.'
  }
  return null
})

const syncForm = (values?: Partial<AdminUserFormValues>) => {
  form.name = values?.name ?? ''
  form.email = values?.email ?? ''
  form.phone = values?.phone ?? ''
  form.role = values?.role ?? 'customer'
  form.password = ''
  form.password_confirmation = ''
}

const handleSubmit = () => {
  if (localError.value) return

  emit('submit', {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() || undefined,
    role: form.role,
    password: form.password.trim() || undefined,
    password_confirmation: form.password_confirmation.trim() || undefined,
  })
}

watch(
  () => props.initialValues,
  (values) => {
    syncForm(values)
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="rounded-3xl border border-surface-container-high bg-surface-container-lowest shadow-sm overflow-hidden">
    <div class="border-b border-surface-container-high px-8 py-6">
      <h1 class="text-3xl font-bold text-on-background">{{ title }}</h1>
      <p class="mt-2 text-sm text-on-surface-variant">{{ description }}</p>
    </div>

    <form class="grid gap-8 p-8" @submit.prevent="handleSubmit">
      <div
        v-if="error || localError"
        class="rounded-2xl border border-error/20 bg-error-container px-5 py-4 text-sm text-on-error-container"
      >
        {{ error || localError }}
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="grid gap-2">
          <label class="text-sm font-semibold text-on-background">Nama</label>
          <input
            v-model="form.name"
            type="text"
            class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
            placeholder="Nama lengkap user"
          />
        </div>

        <div class="grid gap-2">
          <label class="text-sm font-semibold text-on-background">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
            placeholder="user@example.com"
          />
        </div>

        <div class="grid gap-2">
          <label class="text-sm font-semibold text-on-background">Phone</label>
          <input
            v-model="form.phone"
            type="text"
            class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <div class="grid gap-2">
          <label class="text-sm font-semibold text-on-background">Role</label>
          <select
            v-model="form.role"
            class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="grid gap-2">
          <label class="text-sm font-semibold text-on-background">
            {{ requirePassword ? 'Password' : 'Password Baru' }}
          </label>
          <input
            v-model="form.password"
            type="password"
            class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
            :placeholder="requirePassword ? 'Minimal 8 karakter' : 'Kosongkan jika tidak diubah'"
          />
        </div>

        <div class="grid gap-2">
          <label class="text-sm font-semibold text-on-background">Konfirmasi Password</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
            :placeholder="requirePassword ? 'Ulangi password' : 'Ikuti password baru'"
          />
        </div>
      </div>

      <div class="flex flex-col-reverse gap-3 border-t border-surface-container-high pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          class="rounded-2xl border border-surface-container-high px-5 py-3 text-sm font-semibold text-on-background transition hover:bg-surface-container-low"
          @click="emit('cancel')"
        >
          Batal
        </button>
        <button
          type="submit"
          class="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? 'Menyimpan...' : submitLabel }}
        </button>
      </div>
    </form>
  </div>
</template>
