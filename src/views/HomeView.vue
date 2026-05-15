<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import ProductGrid from '@/components/products/ProductGrid.vue'
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
