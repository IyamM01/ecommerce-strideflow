<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import Sidebar from '@/components/admin/Sidebar.vue'
import { orderService } from '@/services/orderService'
import type { Order } from '@/types/order'
import { formatCurrency } from '@/utils/formatCurrency'
import { getApiErrorMessage } from '@/utils/apiResponse'

const loading = ref(false)
const error = ref<string | null>(null)
const deletingId = ref<number | null>(null)
const orders = ref<Order[]>([])
const selectedOrder = ref<Order | null>(null)
const searchQuery = ref('')

const filteredOrders = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  if (!keyword) return orders.value

  return orders.value.filter((order) => {
    const customerName = order.user?.name?.toLowerCase() ?? ''
    const customerEmail = order.user?.email?.toLowerCase() ?? ''
    return (
      order.order_code.toLowerCase().includes(keyword) ||
      order.status.toLowerCase().includes(keyword) ||
      customerName.includes(keyword) ||
      customerEmail.includes(keyword)
    )
  })
})

const statusClass = (status: string) => {
  const value = status.toLowerCase()

  if (value === 'completed' || value === 'paid') return 'bg-emerald-100 text-emerald-800'
  if (value === 'pending') return 'bg-amber-100 text-amber-800'
  if (value === 'cancelled' || value === 'failed') return 'bg-rose-100 text-rose-800'

  return 'bg-surface-container-high text-on-surface-variant'
}

const formatDate = (value?: string | null) => {
  if (!value) return '-'

  return new Date(value).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const fetchOrders = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await orderService.getAll()
    orders.value = response.data ?? []

    if (selectedOrder.value) {
      selectedOrder.value =
        orders.value.find((order) => order.id === selectedOrder.value?.id) ?? null
    }
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Gagal mengambil data order')
  } finally {
    loading.value = false
  }
}

const handleView = async (id: number) => {
  loading.value = true
  error.value = null

  try {
    selectedOrder.value = await orderService.getById(id)
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Gagal mengambil detail order')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('Yakin ingin menghapus order ini?')) return

  deletingId.value = id
  error.value = null

  try {
    await orderService.delete(id)
    orders.value = orders.value.filter((order) => order.id !== id)

    if (selectedOrder.value?.id === id) {
      selectedOrder.value = null
    }
  } catch (err) {
    error.value = getApiErrorMessage(err, 'Gagal menghapus order')
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <div class="bg-background text-on-background font-inter min-h-screen flex">
    <Sidebar />

    <main class="flex-1 md:ml-64 p-margin">
      <header class="mb-margin flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-on-background">Orders</h1>
          <p class="text-on-surface-variant">
            Lihat detail pesanan pelanggan dan hapus order bila diperlukan.
          </p>
        </div>

        <div class="relative w-full max-w-md">
          <span
            class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
          >
            search
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari order code, customer, atau status..."
            class="w-full rounded-2xl border border-surface-container-high bg-surface px-12 py-3 text-sm outline-none transition focus:border-primary"
          />
        </div>
      </header>

      <div
        v-if="error"
        class="mb-6 rounded-2xl border border-error/20 bg-error-container px-5 py-4 text-sm text-on-error-container"
      >
        {{ error }}
      </div>

      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <section
          class="overflow-hidden rounded-3xl border border-surface-container-high bg-surface-container-lowest shadow-sm"
        >
          <div class="border-b border-surface-container-high px-6 py-5">
            <h2 class="text-lg font-bold text-on-background">Daftar Order</h2>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr
                  class="bg-surface-container-low/50 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant"
                >
                  <th class="p-5 pl-6">Order</th>
                  <th class="p-5">Customer</th>
                  <th class="p-5">Tanggal</th>
                  <th class="p-5">Status</th>
                  <th class="p-5">Total</th>
                  <th class="p-5 pr-6 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody class="divide-y divide-surface-container-high">
                <tr v-if="loading && orders.length === 0">
                  <td colspan="6" class="p-8 text-center text-on-surface-variant">
                    Memuat data order...
                  </td>
                </tr>

                <tr
                  v-for="order in filteredOrders"
                  :key="order.id"
                  class="hover:bg-surface-container-low transition-colors"
                >
                  <td class="p-5 pl-6">
                    <div class="flex flex-col">
                      <span class="font-bold text-on-background">#{{ order.order_code }}</span>
                      <span class="text-xs text-on-surface-variant">ID {{ order.id }}</span>
                    </div>
                  </td>

                  <td class="p-5">
                    <div class="flex flex-col">
                      <span class="font-medium text-on-background">{{
                        order.user?.name || 'Guest'
                      }}</span>
                      <span class="text-xs text-on-surface-variant">{{
                        order.user?.email || '-'
                      }}</span>
                    </div>
                  </td>

                  <td class="p-5 text-sm text-on-surface-variant">
                    {{ formatDate(order.created_at) }}
                  </td>

                  <td class="p-5">
                    <span
                      class="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      :class="statusClass(order.status)"
                    >
                      {{ order.status }}
                    </span>
                  </td>

                  <td class="p-5 font-bold text-on-background">
                    {{ formatCurrency(order.total_price) }}
                  </td>

                  <td class="p-5 pr-6">
                    <div class="flex justify-end gap-2">
                      <button
                        class="rounded-xl bg-surface-container-high px-3 py-2 text-xs font-semibold text-on-background transition hover:bg-primary hover:text-white"
                        @click="handleView(order.id)"
                      >
                        Lihat
                      </button>
                      <button
                        class="rounded-xl bg-error-container px-3 py-2 text-xs font-semibold text-on-error-container transition hover:bg-error hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        :disabled="deletingId === order.id"
                        @click="handleDelete(order.id)"
                      >
                        {{ deletingId === order.id ? 'Menghapus...' : 'Hapus' }}
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="!loading && filteredOrders.length === 0">
                  <td colspan="6" class="p-12 text-center text-on-surface-variant">
                    Belum ada order yang cocok dengan pencarian.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <aside
          class="rounded-3xl border border-surface-container-high bg-surface-container-lowest shadow-sm"
        >
          <div class="border-b border-surface-container-high px-6 py-5">
            <h2 class="text-lg font-bold text-on-background">Detail Order</h2>
          </div>

          <div v-if="selectedOrder" class="grid gap-6 p-6">
            <div class="grid gap-2">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-on-surface-variant">Order Code</span>
                <span class="font-bold text-on-background">#{{ selectedOrder.order_code }}</span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-on-surface-variant">Customer</span>
                <span class="text-right text-sm text-on-background">
                  {{ selectedOrder.user?.name || 'Guest' }}
                </span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-on-surface-variant">Email</span>
                <span class="text-right text-sm text-on-background">
                  {{ selectedOrder.user?.email || '-' }}
                </span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-on-surface-variant">Tanggal</span>
                <span class="text-right text-sm text-on-background">
                  {{ formatDate(selectedOrder.created_at) }}
                </span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-on-surface-variant">Status</span>
                <span
                  class="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                  :class="statusClass(selectedOrder.status)"
                >
                  {{ selectedOrder.status }}
                </span>
              </div>
            </div>

            <div class="grid gap-3">
              <h3 class="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                Items
              </h3>

              <div
                v-for="item in selectedOrder.items"
                :key="item.id"
                class="rounded-2xl border border-surface-container-high bg-surface-container-low p-4"
              >
                <div class="flex items-start gap-3">
                  <img
                    :src="item.product?.image_url || 'https://placehold.co/120x120?text=No+Image'"
                    :alt="item.product?.name || 'Product'"
                    class="h-16 w-16 rounded-xl object-cover"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="font-semibold text-on-background">
                      {{ item.product?.name || 'Produk terhapus' }}
                    </p>
                    <p class="text-xs text-on-surface-variant">
                      {{ item.quantity }} x {{ formatCurrency(item.price) }}
                    </p>
                    <p class="mt-1 text-sm font-bold text-on-background">
                      {{ formatCurrency(item.subtotal) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="grid gap-2 rounded-2xl border border-surface-container-high bg-surface-container-low p-4"
            >
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-on-surface-variant">Payment</span>
                <span
                  class="inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                  :class="statusClass(selectedOrder.payment?.status || 'pending')"
                >
                  {{ selectedOrder.payment?.status || 'pending' }}
                </span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-on-surface-variant">Provider</span>
                <span class="text-sm text-on-background">{{
                  selectedOrder.payment?.provider || '-'
                }}</span>
              </div>
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-on-surface-variant">Invoice</span>
                <span class="text-right text-sm text-on-background">{{
                  selectedOrder.payment?.invoice_id || '-'
                }}</span>
              </div>
              <div
                class="flex items-center justify-between gap-3 border-t border-surface-container-high pt-2"
              >
                <span class="text-sm font-semibold text-on-surface-variant">Total</span>
                <span class="text-lg font-bold text-on-background">{{
                  formatCurrency(selectedOrder.total_price)
                }}</span>
              </div>
            </div>
          </div>

          <div v-else class="p-6 text-sm text-on-surface-variant">
            Pilih salah satu order untuk melihat detailnya.
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>
