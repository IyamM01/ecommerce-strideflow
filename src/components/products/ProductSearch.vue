<script setup lang="ts">
import { ref, watch } from 'vue'
import { Search, X } from '@lucide/vue'

import { useProductStore } from '@/stores/productStore'

const productStore = useProductStore()
const searchQuery = ref(productStore.searchQuery)

watch(
  () => productStore.searchQuery,
  (value) => {
    searchQuery.value = value
  },
)

const applySearch = () => {
  productStore.resetCatalogFilters()
  productStore.setSearchQuery(searchQuery.value.trim())
}

watch(searchQuery, applySearch)

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <form class="w-full sm:w-80 lg:w-96" role="search" @submit.prevent="applySearch">
    <label class="sr-only" for="collection-product-search">Search products</label>
    <div
      class="flex h-11 min-w-0 items-center rounded-xl border border-gray-200 bg-white px-4 transition focus-within:border-black"
    >
      <Search class="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
      <input
        id="collection-product-search"
        v-model="searchQuery"
        type="text"
        placeholder="Search products"
        class="min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />
      <button
        v-if="searchQuery"
        class="ml-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
        type="button"
        aria-label="Clear search"
        @click="clearSearch"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </form>
</template>
