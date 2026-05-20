<script setup lang="ts">
import { ShoppingCart } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import type { Product } from '@/types/product'

defineProps<{
  products: Product[]
}>()

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
</script>

<template>
  <section v-if="products.length > 0" class="py-16 border-t border-gray-100">
    <h2 class="text-2xl font-bold text-black mb-10 text-center">Complete The Look</h2>
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <RouterLink
        v-for="product in products"
        :key="product.id"
        :to="`/products/${product.id}`"
        class="group cursor-pointer block"
      >
        <div class="bg-[#F6F6F6] rounded-2xl overflow-hidden aspect-[4/5] mb-3 relative shadow-sm">
          <img
            :src="product.image_url || 'https://placehold.co/400x500?text=No+Image'"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            class="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black hover:text-white"
            @click.prevent
          >
            <ShoppingCart :size="16" />
          </button>
        </div>
        <div>
          <p
            v-if="product.brand"
            class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5"
          >
            {{ product.brand.name }}
          </p>
          <h3 class="text-sm font-semibold text-black mb-1 line-clamp-1">{{ product.name }}</h3>
          <p class="text-sm font-bold text-black">{{ formatPrice(product.price) }}</p>
        </div>
      </RouterLink>
    </div>
  </section>
</template>
