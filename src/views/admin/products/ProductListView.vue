<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import Sidebar from '@/components/admin/Sidebar.vue'
import { useRouter } from 'vue-router'

const productStore = useProductStore()
const router = useRouter()
const searchQuery = ref('')

onMounted(() => {
  productStore.fetchProducts()
})

const filteredProducts = computed(() => {
  if (!searchQuery.value) return productStore.products
  return productStore.products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const handleDelete = async (id: number) => {
  if (confirm('Yakin ingin menghapus produk ini?')) {
    try {
      await productStore.deleteProduct(id)
      alert('Produk berhasil dihapus')
    } catch {
      alert(productStore.error || 'Gagal menghapus produk')
    }
  }
}

const handleEdit = (id: number) => {
  router.push(`/admin/products/${id}/edit`)
}
</script>

<template>
  <div class="bg-background text-on-background font-inter min-h-screen flex">
    <Sidebar />

    <main class="flex-1 md:ml-64 p-margin">
      <header class="mb-margin flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-on-background">Products</h1>
          <p class="text-on-surface-variant">Manage your store's inventory and product details.</p>
        </div>

        <button
          @click="router.push('/admin/products/create')"
          class="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <span class="material-symbols-outlined">add</span>
          Add New Product
        </button>
      </header>

      <div
        class="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-high overflow-hidden"
      >
        <!-- Table Header / Search -->
        <div
          class="p-6 border-b border-surface-container-high flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div class="relative flex-1 max-w-md">
            <span
              class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
              >search</span
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products by name or SKU..."
              class="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div class="flex gap-2">
            <button
              class="p-3 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <span class="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-surface-container-low/50 text-on-surface-variant text-[11px] font-bold uppercase tracking-widest border-b border-surface-container-high"
              >
                <th class="p-5 pl-8">Product</th>
                <th class="p-5">Category</th>
                <th class="p-5">Price</th>
                <th class="p-5">Stock</th>
                <th class="p-5">Status</th>
                <th class="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-surface-container-high">
              <template v-if="productStore.loading">
                <tr v-for="i in 5" :key="i" class="animate-pulse">
                  <td colspan="6" class="p-8 text-center text-on-surface-variant">
                    Loading products...
                  </td>
                </tr>
              </template>

              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="hover:bg-surface-container-low transition-colors group"
              >
                <td class="p-5 pl-8">
                  <div class="flex items-center gap-4">
                    <div
                      class="w-14 h-14 rounded-xl bg-surface-container-high overflow-hidden flex-shrink-0 border border-surface-container-highest"
                    >
                      <img
                        :src="product.image_url || 'https://placehold.co/160x160?text=No+Image'"
                        :alt="product.name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="flex flex-col min-w-0">
                      <span class="font-bold text-on-background truncate">{{ product.name }}</span>
                      <span
                        class="text-xs text-on-surface-variant uppercase tracking-wider font-medium"
                        >{{ product.sku || 'NO SKU' }}</span
                      >
                    </div>
                  </div>
                </td>

                <td class="p-5">
                  <span
                    class="px-3 py-1 bg-surface-container-high text-on-surface text-xs font-bold rounded-full"
                  >
                    {{ product.category?.name || 'Uncategorized' }}
                  </span>
                </td>

                <td class="p-5 font-bold text-on-background">
                  {{ formatCurrency(product.price) }}
                </td>

                <td class="p-5">
                  <div class="flex flex-col gap-1">
                    <span class="font-semibold text-sm">{{ product.stock }} items</span>
                    <div class="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="
                          product.stock <= 5
                            ? 'bg-error'
                            : product.stock <= 15
                              ? 'bg-amber-500'
                              : 'bg-primary'
                        "
                        :style="{ width: Math.min(product.stock * 2, 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>

                <td class="p-5">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                    :class="
                      product.stock > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    "
                  >
                    {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </td>

                <td class="p-5 pr-8">
                  <div
                    class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      @click="handleEdit(product.id)"
                      class="p-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-white transition-all"
                      title="Edit Product"
                    >
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      @click="handleDelete(product.id)"
                      class="p-2 rounded-lg bg-surface-container-high text-error hover:bg-error hover:text-white transition-all"
                      title="Delete Product"
                    >
                      <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="!productStore.loading && filteredProducts.length === 0">
                <td colspan="6" class="p-20 text-center">
                  <div class="flex flex-col items-center gap-4 text-on-surface-variant">
                    <span class="material-symbols-outlined text-6xl opacity-20">inventory_2</span>
                    <p class="font-medium">
                      No products found. Try a different search or add a new product.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>
