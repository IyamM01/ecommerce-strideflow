<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Sidebar from '@/components/admin/Sidebar.vue'
import ProductForm from '@/components/admin/ProductForm.vue'
import { useProductStore } from '@/stores/productStore'
import type { ProductPayload } from '@/types/product'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const productId = computed(() => Number(route.params.id))
const submitError = computed(() => productStore.error)
const initialValues = computed(() => {
  const product = productStore.product

  if (!product) return {}

  return {
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category_id: product.category_id ?? product.category?.id ?? null,
    brand_id: product.brand_id ?? product.brand?.id ?? null,
    gender_id: product.gender_id ?? product.gender?.id ?? null,
    sku: product.sku ?? '',
    size: product.size ?? '',
    color: product.color ?? '',
    badge: product.badge ?? '',
    image_url: product.image_url,
  }
})

const loadProduct = async () => {
  if (Number.isNaN(productId.value)) {
    await router.push('/admin/products')
    return
  }

  await productStore.fetchProductById(productId.value)

  if (!productStore.product && productStore.error) {
    await router.push('/admin/products')
  }
}

const handleSubmit = async (payload: ProductPayload) => {
  if (Number.isNaN(productId.value)) return

  try {
    await productStore.updateProduct(productId.value, payload)
    await router.push('/admin/products')
  } catch {
    // Handled by store state.
  }
}

onMounted(() => {
  loadProduct()
})
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

      <div
        v-if="productStore.loading && !productStore.product"
        class="rounded-3xl border border-surface-container-high bg-surface-container-lowest p-10 text-center text-on-surface-variant"
      >
        Memuat detail produk...
      </div>

      <ProductForm
        v-else
        title="Edit Produk"
        description="Perbarui detail produk supaya stok dan tampilan toko tetap akurat."
        submit-label="Update Produk"
        :loading="productStore.loading"
        :errors="productStore.validationErrors"
        :initial-values="initialValues"
        @submit="handleSubmit"
        @cancel="router.push('/admin/products')"
      />
    </main>
  </div>
</template>
