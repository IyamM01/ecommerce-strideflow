<script setup lang="ts">
import Navbar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import ProductGrid from '@/components/products/ProductGrid.vue'
import ProductFilter from '@/components/products/ProductFilter.vue'
</script>

<template>
  <Navbar />

  <main class="mx-auto w-full max-w-[1600px] flex-grow px-6 py-12 lg:px-12">
    <!-- Page Header -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-black">Women's Collection</h1>
      <p class="text-sm text-gray-400 mt-1">Explore our curated collection for women</p>
    </div>

    <div class="flex flex-col md:flex-row gap-12">
      <!-- Sidebar Filter -->
      <ProductFilter />

      <!-- Product Area -->
      <div class="flex-grow flex flex-col gap-8">
        <!-- Top Actions -->
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-500"> Showing all products </span>
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-500">Sort by:</span>
            <select
              class="rounded-lg border border-gray-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-gray-900 focus:border-black focus:ring-1 focus:ring-black transition-colors cursor-pointer"
            >
              <option>New Arrivals</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Popularity</option>
            </select>
          </div>
        </div>

        <!-- Grid -->
        <ProductGrid gender="Women" category="all" />

        <!-- Load More -->
        <div class="mt-12 flex justify-center">
          <button
            class="px-10 py-4 border-2 border-black rounded-full text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
          >
            Load More Products
          </button>
        </div>
      </div>
    </div>
  </main>

  <Footer />
</template>
