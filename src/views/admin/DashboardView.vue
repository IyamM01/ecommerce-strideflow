<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'

import Sidebar from '@/components/admin/Sidebar.vue'
import StatsCard from '@/components/admin/StatsCard.vue'
import RevenueChart from '@/components/admin/RevenueChart.vue'
import LowStockList from '@/components/admin/LowStockList.vue'
import RecentOrdersTable from '@/components/admin/RecentOrdersTable.vue'

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.fetchDashboardData()
})
</script>

<template>
  <div class="bg-background text-on-background font-inter min-h-screen flex">
    <Sidebar />

    <main class="flex-1 md:ml-64 p-margin">
      <header class="mb-margin flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-on-background">Overview</h1>
          <p class="text-on-surface-variant">Here's what's happening with your store today.</p>
        </div>
      </header>

      <div
        v-if="dashboardStore.loading"
        class="bg-surface-container-lowest border border-surface-container-high rounded-lg p-6 text-center text-on-surface-variant"
      >
        Loading dashboard data...
      </div>

      <template v-else>
        <div class="mb-margin grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Pendapatan" :value="dashboardStore.stats.revenue" icon="payments" />
          <StatsCard
            title="Total Orders"
            :value="dashboardStore.stats.orders"
            icon="receipt_long"
          />
          <StatsCard
            title="Total Produk"
            :value="dashboardStore.stats.products"
            icon="inventory_2"
          />
          <StatsCard title="Banyak User" :value="dashboardStore.stats.users" icon="group" />
        </div>

        <section
          class="mb-margin rounded-2xl border border-surface-container-high bg-surface-container-lowest p-6 shadow-sm"
        >
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-xl font-bold text-on-background">Product References</h2>
              <p class="mt-1 text-sm text-on-surface-variant">
                Kelola brand dan gender sebelum membuat produk baru.
              </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
              <RouterLink
                to="/admin/brands"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:opacity-90"
              >
                <span class="material-symbols-outlined text-[18px]">sell</span>
                Manage Brands
              </RouterLink>

              <RouterLink
                to="/admin/genders"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-container-high px-5 py-3 text-sm font-bold text-on-background transition hover:bg-surface-container-low"
              >
                <span class="material-symbols-outlined text-[18px]">category</span>
                Manage Gender
              </RouterLink>
            </div>
          </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-margin">
          <RevenueChart class="lg:col-span-2" :items="dashboardStore.revenueChart" />

          <LowStockList :items="dashboardStore.lowStockItems" />
        </div>

        <RecentOrdersTable :orders="dashboardStore.recentOrders" />
      </template>
    </main>
  </div>
</template>
