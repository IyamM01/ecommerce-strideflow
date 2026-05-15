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
          <p class="text-on-surface-variant">
            Here's what's happening with your store today.
          </p>
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
          <StatsCard
            title="Pendapatan"
            :value="dashboardStore.stats.revenue"
            icon="payments"
          />
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
          <StatsCard
            title="Banyak User"
            :value="dashboardStore.stats.users"
            icon="group"
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-margin">
          <RevenueChart
            class="lg:col-span-2"
            :items="dashboardStore.revenueChart"
          />

          <LowStockList :items="dashboardStore.lowStockItems" />
        </div>

        <RecentOrdersTable :orders="dashboardStore.recentOrders" />
      </template>
    </main>
  </div>
</template>
