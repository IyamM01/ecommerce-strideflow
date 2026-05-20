<script setup lang="ts">
import { formatCurrency } from '@/utils/formatCurrency'

defineProps<{
  totalItems: number
  totalPrice: number
}>()

const emit = defineEmits<{
  clear: []
  checkout: []
}>()
</script>

<template>
  <aside class="h-fit rounded-2xl border border-gray-200 bg-white p-6">
    <h2 class="text-lg font-bold text-black">Order Summary</h2>

    <div class="mt-6 space-y-4">
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Total Items</span>
        <span class="font-bold text-black">
          {{ totalItems }}
        </span>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Subtotal</span>
        <span class="font-bold text-black">
          {{ formatCurrency(totalPrice) }}
        </span>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Shipping</span>
        <span class="font-bold text-black"> Free </span>
      </div>

      <div class="border-t border-gray-200 pt-4">
        <div class="flex justify-between text-base font-extrabold">
          <span>Total</span>
          <span>
            {{ formatCurrency(totalPrice) }}
          </span>
        </div>
      </div>
    </div>

    <button
      class="mt-8 w-full rounded-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-gray-800"
      @click="emit('checkout')"
    >
      Checkout
    </button>

    <button
      class="mt-4 w-full text-sm font-bold text-gray-400 transition hover:text-red-500"
      @click="emit('clear')"
    >
      Clear Cart
    </button>
  </aside>
</template>
