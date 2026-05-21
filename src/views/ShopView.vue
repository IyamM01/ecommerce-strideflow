<script setup lang="ts">
import Navbar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import ProductFilter from '@/components/products/ProductFilter.vue'
import ProductGrid from '@/components/products/ProductGrid.vue'
import ProductSearch from '@/components/products/ProductSearch.vue'
</script>

<template>
  <Navbar />

  <main class="mx-auto w-full max-w-[1600px] flex-grow px-6 py-12 lg:px-12">
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-black">Shop</h1>
      <p class="mt-1 text-sm text-gray-400">Explore every item available in the store</p>
    </div>

    <div class="flex flex-col gap-12 md:flex-row">
      <ProductFilter />

      <div class="flex-grow flex flex-col gap-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span class="text-sm font-medium text-gray-500">Showing all items</span>
          <ProductSearch />
        </div>

        <ProductGrid category="all" />

        <div class="mt-12 flex justify-center">
          <button
            class="rounded-full border-2 border-black px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:bg-black hover:text-white"
          >
            Load More Products
          </button>
        </div>
      </div>
    </div>
  </main>

  <Footer />
</template>
