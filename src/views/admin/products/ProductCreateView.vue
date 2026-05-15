<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import Sidebar from '@/components/admin/Sidebar.vue'
import ProductForm from '@/components/admin/ProductForm.vue'
import { useProductStore } from '@/stores/productStore'
import type { ProductPayload } from '@/types/product'

const router = useRouter()
const productStore = useProductStore()

const submitError = computed(() => productStore.error)

const handleSubmit = async (payload: ProductPayload) => {
  try {
    await productStore.createProduct(payload)
    await router.push('/admin/products')
  } catch {
    // Handled by store state.
  }
}
</script>

<template>
  <div class="bg-background text-on-background font-inter min-h-screen flex">
    <Sidebar />

    <main class="flex-1 md:ml-64 p-margin">
      <div
        v-if="submitError"
        class="mb-6 rounded-2xl border border-error/20 bg-error-container px-5 py-4 text-sm text-on-error-container"
      >
        {{ submitError }}
      </div>

      <ProductForm
        title="Tambah Produk"
        description="Buat produk baru dan tampilkan langsung di etalase toko."
        submit-label="Simpan Produk"
        :loading="productStore.loading"
        :errors="productStore.validationErrors"
        :require-image="true"
        @submit="handleSubmit"
        @cancel="router.push('/admin/products')"
      />
    </main>
  </div>
</template>
