<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CartItem } from '@/types/cart'
import { formatCurrency } from '@/utils/formatCurrency'

defineProps<{
  item: CartItem
}>()

const emit = defineEmits<{
  decrease: [productId: number, color?: string, size?: string]
  increase: [productId: number, color?: string, size?: string]
  remove: [productId: number, color?: string, size?: string]
}>()
</script>

<template>
  <div class="flex gap-5 rounded-lg border border-gray-200 bg-white p-5">
    <RouterLink :to="`/products/${item.product.id}`">
      <img
        :src="item.product.image_url || 'https://placehold.co/400x500?text=No+Image'"
        :alt="item.product.name"
        class="h-28 w-28 rounded-lg bg-gray-100 object-cover sm:h-32 sm:w-32"
      />
    </RouterLink>

    <div class="flex flex-1 flex-col justify-between">
      <div>
        <RouterLink :to="`/products/${item.product.id}`">
          <h2 class="text-base font-bold text-black hover:text-gray-600">
            {{ item.product.name }}
          </h2>
        </RouterLink>

        <p v-if="item.product.brand?.name" class="mt-1 text-sm text-gray-400">
          {{ item.product.brand.name }}
        </p>

        <p class="mt-2 text-sm font-semibold text-black">
          {{ formatCurrency(item.product.price) }}
        </p>

        <div v-if="item.color || item.size" class="mt-2 flex gap-3">
          <p v-if="item.color" class="text-xs text-gray-400">
            Color: <span class="text-black font-semibold">{{ item.color }}</span>
          </p>
          <p v-if="item.size" class="text-xs text-gray-400">
            Size: <span class="text-black font-semibold">{{ item.size }}</span>
          </p>
        </div>
      </div>

      <div class="mt-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg font-bold transition hover:bg-gray-100"
            @click="emit('decrease', item.product.id, item.color, item.size)"
          >
            -
          </button>

          <span class="w-8 text-center text-sm font-bold">
            {{ item.quantity }}
          </span>

          <button
            class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg font-bold transition hover:bg-gray-100"
            @click="emit('increase', item.product.id, item.color, item.size)"
          >
            +
          </button>
        </div>

        <button
          class="text-sm font-bold text-red-500 transition hover:text-red-700"
          @click="emit('remove', item.product.id, item.color, item.size)"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
