<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import { useProductStore } from '@/stores/productStore'
import type { Product } from '@/types/product'

const route = useRoute()
const productStore = useProductStore()
const SECTION_PRODUCT_LIMIT = 5

const getSalesScore = (product: Product) =>
  Number(
    product.sold_count ??
      product.total_sold ??
      product.sales_count ??
      product.order_count ??
      product.purchased_count ??
      0,
  )

const getBadgeScore = (product: Product) => {
  const badge = product.badge?.toLowerCase() ?? ''

  if (badge.includes('best') || badge.includes('popular') || badge.includes('hot')) return 1

  return 0
}

const getCreatedTime = (product: Product) => {
  const time = product.created_at ? new Date(product.created_at).getTime() : 0

  return Number.isNaN(time) ? 0 : time
}

const bestSellerProducts = computed(() =>
  [...productStore.products]
    .sort((first, second) => {
      const salesDifference = getSalesScore(second) - getSalesScore(first)
      const badgeDifference = getBadgeScore(second) - getBadgeScore(first)
      const stockDifference = first.stock - second.stock

      return salesDifference || badgeDifference || stockDifference || second.id - first.id
    })
    .slice(0, SECTION_PRODUCT_LIMIT),
)

const newLaunchProducts = computed(() =>
  [...productStore.products]
    .sort((first, second) => {
      const dateDifference = getCreatedTime(second) - getCreatedTime(first)

      return dateDifference || second.id - first.id
    })
    .slice(0, SECTION_PRODUCT_LIMIT),
)

const syncSearchQuery = () => {
  const query = route.query.q
  productStore.resetCatalogFilters()
  productStore.setSearchQuery(typeof query === 'string' ? query : '')
}

onMounted(async () => {
  syncSearchQuery()

  if (productStore.products.length === 0) {
    await productStore.fetchProducts()
  }
})
watch(() => route.query.q, syncSearchQuery)
</script>

<template>
  <NavBar />
  <main class="min-h-screen bg-white">
    <HeroSection />

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div v-if="productStore.loading" class="flex h-64 items-center justify-center">
        <div
          class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"
        ></div>
      </div>

      <div v-else-if="productStore.error" class="rounded-lg bg-red-50 p-8 text-center text-red-600">
        <p class="font-medium">{{ productStore.error }}</p>
        <button
          class="mt-4 text-sm font-bold uppercase tracking-widest underline decoration-2 underline-offset-4"
          @click="productStore.fetchProducts"
        >
          Try Again
        </button>
      </div>

      <template v-else>
        <div class="mb-16">
          <div class="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 class="text-2xl font-black text-gray-950">Banyak Dibeli</h2>
              <p class="mt-1 text-sm font-medium text-gray-500">
                Produk yang paling banyak diminati pelanggan.
              </p>
            </div>

            <RouterLink
              to="/shop"
              class="hidden text-sm font-bold uppercase tracking-widest text-gray-900 underline underline-offset-4 sm:inline-flex"
            >
              View All
            </RouterLink>
          </div>

          <div
            v-if="bestSellerProducts.length > 0"
            class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            <ProductCard
              v-for="product in bestSellerProducts"
              :key="`best-${product.id}`"
              :product="product"
            />
          </div>

          <div v-else class="rounded-lg bg-gray-50 py-16 text-center text-gray-500">
            Belum ada produk banyak dibeli.
          </div>
        </div>

        <div>
          <div class="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 class="text-2xl font-black text-gray-950">Baru Launching</h2>
              <p class="mt-1 text-sm font-medium text-gray-500">
                Produk terbaru yang baru masuk ke etalase.
              </p>
            </div>

            <RouterLink
              to="/shop"
              class="hidden text-sm font-bold uppercase tracking-widest text-gray-900 underline underline-offset-4 sm:inline-flex"
            >
              View All
            </RouterLink>
          </div>

          <div
            v-if="newLaunchProducts.length > 0"
            class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            <ProductCard
              v-for="product in newLaunchProducts"
              :key="`new-${product.id}`"
              :product="product"
            />
          </div>

          <div v-else class="rounded-lg bg-gray-50 py-16 text-center text-gray-500">
            Belum ada produk baru.
          </div>
        </div>
      </template>
    </section>
  </main>
  <Footer />
</template>

<style scoped></style>
