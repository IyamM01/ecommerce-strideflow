<script setup lang="ts">
import { onMounted, ref, toRef } from 'vue'
import { useRoute } from 'vue-router'

import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import ProfileEditForm from '@/components/profile/ProfileEditForm.vue'
import ProfileRecentOrders from '@/components/profile/ProfileRecentOrders.vue'
import ProfileSummaryCard from '@/components/profile/ProfileSummaryCard.vue'
import { useProfilePage } from '@/composables/useProfilePage'

const route = useRoute()
const ordersSection = ref<HTMLElement | null>(null)
const routePath = toRef(route, 'path')
const {
  displayName,
  error,
  form,
  handleDiscard,
  handleSubmit,
  initials,
  loadProfilePage,
  loading,
  memberSince,
  profile,
  recentOrders,
  saving,
  successMessage,
} = useProfilePage(routePath, ordersSection)

onMounted(() => {
  loadProfilePage()
})
</script>

<template>
  <NavBar />

  <main class="min-h-screen bg-background px-6 py-10 lg:px-10">
    <div class="mx-auto max-w-7xl">
      <header class="mb-8 flex flex-col gap-4 border-b border-outline-variant pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-on-background">Account Profile</h1>
          <p class="mt-2 text-sm text-on-surface-variant">
            Kelola informasi akun pribadi dan lihat ringkasan pesanan terbaru Anda.
          </p>
        </div>

        <div class="inline-flex items-center gap-2 rounded-xl bg-secondary-container px-5 py-3 text-sm font-semibold text-white">
          <span class="material-symbols-outlined text-[18px]">verified_user</span>
          {{ profile?.role === 'admin' ? 'Admin Account' : 'Customer Account' }}
        </div>
      </header>

      <div
        v-if="loading"
        class="rounded-3xl border border-surface-container-high bg-surface-container-lowest p-10 text-center text-on-surface-variant shadow-sm"
      >
        Memuat data profile...
      </div>

      <template v-else>
        <div v-if="error" class="mb-6 rounded-2xl border border-error/20 bg-error-container px-5 py-4 text-sm text-on-error-container">
          {{ error }}
        </div>

        <div v-if="successMessage" class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          {{ successMessage }}
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div class="flex flex-col gap-6 lg:col-span-4">
            <ProfileSummaryCard
              :display-name="displayName"
              :email="profile?.email"
              :initials="initials"
              :member-since="memberSince"
            />
          </div>

          <ProfileEditForm
            :form="form"
            :saving="saving"
            @discard="handleDiscard"
            @submit="handleSubmit"
          />
        </div>

        <div ref="ordersSection">
          <ProfileRecentOrders :orders="recentOrders" />
        </div>
      </template>
    </div>
  </main>

  <Footer />
</template>
