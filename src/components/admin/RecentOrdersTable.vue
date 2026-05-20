<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  orders: {
    id: string
    customer: string
    date: string
    status: string
    total: string
  }[]
}>()
</script>

<template>
  <div
    class="bg-surface-container-lowest rounded-lg shadow-sm border border-surface-container-high overflow-hidden"
  >
    <div class="p-6 border-b border-surface-container-high flex justify-between items-center">
      <h2 class="text-xl font-bold text-on-background">Recent Orders</h2>

      <RouterLink
        to="/admin/orders"
        class="text-primary-container text-sm font-semibold hover:underline"
      >
        View All Orders
      </RouterLink>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="bg-surface-container-low border-b border-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-wider"
          >
            <th class="p-4 pl-6">Order ID</th>
            <th class="p-4">Customer</th>
            <th class="p-4">Date</th>
            <th class="p-4">Status</th>
            <th class="p-4 pr-6 text-right">Total</th>
          </tr>
        </thead>

        <tbody class="text-sm">
          <tr
            v-for="order in orders"
            :key="order.id"
            class="border-b border-surface-container-high hover:bg-surface-container-low transition-colors"
          >
            <td class="p-4 pl-6 font-semibold text-on-background">
              {{ order.id }}
            </td>

            <td class="p-4 text-on-background">
              {{ order.customer }}
            </td>

            <td class="p-4 text-on-surface-variant">
              {{ order.date }}
            </td>

            <td class="p-4">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold"
                :class="getStatusClass(order.status)"
              >
                {{ order.status }}
              </span>
            </td>

            <td class="p-4 pr-6 text-right font-bold text-on-background">
              {{ order.total }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    getStatusClass(status: string) {
      const s = status.toLowerCase()
      if (s === 'completed') {
        return 'bg-[#ecfdf5] text-[#065f46]'
      }
      if (s === 'shipped') {
        return 'bg-[#eff6ff] text-[#1e40af]'
      }
      if (s === 'pending') {
        return 'bg-[#fffbeb] text-[#92400e]'
      }
      if (s === 'cancelled') {
        return 'bg-[#fef2f2] text-[#991b1b]'
      }
      return 'bg-surface-container-highest text-on-surface-variant'
    },
  },
}
</script>
