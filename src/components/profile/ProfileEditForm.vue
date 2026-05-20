<script setup lang="ts">
import type { ProfileFormValues } from '@/types/profile'

defineProps<{
  form: ProfileFormValues
  saving: boolean
}>()

const emit = defineEmits<{
  submit: []
  discard: []
  updateField: [field: keyof ProfileFormValues, value: string]
}>()

const updateField = (field: keyof ProfileFormValues, event: Event) => {
  emit('updateField', field, (event.target as HTMLInputElement).value)
}
</script>

<template>
  <section
    class="rounded-3xl border border-surface-container-high bg-surface-container-lowest p-8 shadow-sm lg:col-span-8"
  >
    <h2 class="text-2xl font-bold text-on-background">Edit Details</h2>

    <form
      class="mt-6 grid grid-cols-1 gap-x-gutter gap-y-5 md:grid-cols-2"
      @submit.prevent="emit('submit')"
    >
      <div class="grid gap-2">
        <label class="text-sm font-semibold text-on-surface-variant">First Name</label>
        <input
          :value="form.firstName"
          type="text"
          class="min-h-12 rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
          @input="updateField('firstName', $event)"
        />
      </div>

      <div class="grid gap-2">
        <label class="text-sm font-semibold text-on-surface-variant">Last Name</label>
        <input
          :value="form.lastName"
          type="text"
          class="min-h-12 rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
          @input="updateField('lastName', $event)"
        />
      </div>

      <div class="grid gap-2 md:col-span-2">
        <label class="text-sm font-semibold text-on-surface-variant">Email Address</label>
        <input
          :value="form.email"
          type="email"
          class="min-h-12 rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
          @input="updateField('email', $event)"
        />
      </div>

      <div class="grid gap-2 md:col-span-2">
        <label class="text-sm font-semibold text-on-surface-variant">Phone Number</label>
        <input
          :value="form.phone"
          type="tel"
          class="min-h-12 rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary"
          @input="updateField('phone', $event)"
        />
      </div>

      <div
        class="mt-2 flex flex-col-reverse gap-3 border-t border-outline-variant pt-6 md:col-span-2 sm:flex-row sm:justify-end"
      >
        <button
          type="button"
          class="min-h-12 px-6 py-3 text-sm font-semibold text-on-surface-variant transition hover:text-on-surface"
          @click="emit('discard')"
        >
          Discard
        </button>
        <button
          type="submit"
          class="min-h-12 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="saving"
        >
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </section>
</template>
