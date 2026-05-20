<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import ProductGrid from '@/components/products/ProductGrid.vue'
import { useProductStore } from '@/stores/productStore'

const route = useRoute()
const productStore = useProductStore()

const syncSearchQuery = () => {
  const query = route.query.q
  productStore.setSearchQuery(typeof query === 'string' ? query : '')
}

onMounted(syncSearchQuery)
watch(() => route.query.q, syncSearchQuery)
</script>

<template>
  <NavBar />
  <main class="min-h-screen bg-white">
    <HeroSection />
    <ProductGrid />
  </main>
  <Footer />
</template>

<style scoped></style>
