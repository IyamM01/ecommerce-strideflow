<script setup lang="ts">
import type { Order } from '@/types/order'
import { formatCurrency } from '@/utils/formatCurrency'

defineProps<{
  orders: Order[]
}>()

const statusClass = (status: string) => {
  const value = status.toLowerCase()

  if (value === 'completed' || value === 'paid' || value === 'delivered') {
    return 'bg-emerald-100 text-emerald-800'
  }

  if (value === 'pending' || value === 'shipped') {
    return 'bg-amber-100 text-amber-800'
  }

  if (value === 'cancelled' || value === 'failed') {
    return 'bg-rose-100 text-rose-800'
  }

  return 'bg-surface-container-high text-on-surface-variant'
}

const formatDate = (value?: string) => {
  if (!value) return '-'

  return new Date(value).toLocaleDateString('id-ID', {
    dateStyle: 'medium',
  })
}
</script>

<template>
  <section class="mt-10">
    <div class="mb-4 flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-on-background">Recent Orders</h2>
        <p class="mt-1 text-sm text-on-surface-variant">Pesanan terbaru dari akun Anda.</p>
      </div>
    </div>

    <div
      class="overflow-hidden rounded-3xl border border-surface-container-high bg-surface-container-lowest shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-outline-variant bg-surface-container-low">
              <th
                class="p-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant"
              >
                Order ID
              </th>
              <th
                class="p-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant"
              >
                Date
              </th>
              <th
                class="p-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant"
              >
                Items
              </th>
              <th
                class="p-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant"
              >
                Total
              </th>
              <th
                class="p-4 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant"
              >
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="order in orders"
              :key="order.id"
              class="border-b border-outline-variant last:border-b-0 hover:bg-surface transition-colors"
            >
              <td class="p-4 font-semibold text-on-background">#{{ order.order_code }}</td>
              <td class="p-4 text-sm text-on-surface-variant">
                {{ formatDate(order.created_at) }}
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <img
                    v-if="order.items[0]?.product?.image_url"
                    :src="order.items[0].product?.image_url"
                    :alt="order.items[0].product?.name || 'Product'"
                    class="h-8 w-8 rounded border border-outline-variant object-cover"
                  />
                  <span class="text-sm text-on-surface">
                    {{ order.items[0]?.product?.name || 'Produk' }}
                    <template v-if="order.items.length > 1">
                      + {{ order.items.length - 1 }} lainnya
                    </template>
                  </span>
                </div>
              </td>
              <td class="p-4 font-semibold text-on-background">
                {{ formatCurrency(order.total_price) }}
              </td>
              <td class="p-4">
                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize"
                  :class="statusClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </td>
            </tr>

            <tr v-if="orders.length === 0">
              <td colspan="5" class="p-10 text-center text-sm text-on-surface-variant">
                Belum ada pesanan untuk akun ini.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
