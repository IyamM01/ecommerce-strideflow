<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import ProductCard from '@/components/products/ProductCard.vue'

const props = defineProps<{
  gender?: string
  category?: string
}>()

const productStore = useProductStore()

onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchProducts()
  }
})

const filteredProducts = computed(() => {
  return productStore.filteredProducts.filter((product) => {
    const productGender = product.gender?.slug || product.gender?.name || product.gender

    const matchGender = props.gender
      ? String(productGender).toLowerCase() === props.gender.toLowerCase()
      : true

    const matchCategory =
      props.category && props.category !== 'all'
        ? product.category?.slug === props.category || product.category?.name === props.category
        : true

    return matchGender && matchCategory
  })
})
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

    <!-- Loading State -->
    <div v-if="productStore.loading" class="flex h-64 items-center justify-center">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="productStore.error" class="rounded-xl bg-red-50 p-8 text-center text-red-600">
      <p class="font-medium">{{ productStore.error }}</p>
      <button
        @click="productStore.fetchProducts"
        class="mt-4 text-sm font-bold uppercase tracking-widest underline decoration-2 underline-offset-4"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="rounded-xl bg-gray-50 py-24 text-center">
      <p class="text-gray-500">No products found. Please check back later!</p>
    </div>

    <!-- Product Grid -->
    <div v-else class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>
