<script setup lang="ts">
import Navbar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import CartEmpty from '@/components/cart/CartEmpty.vue'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
const router = useRouter()

const handleCheckout = () => {
  router.push('/checkout')
}
</script>

<template>
  <Navbar />

  <main class="mx-auto min-h-screen w-full max-w-[1600px] px-6 py-12 lg:px-12">
    <!-- Page Header -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-black">Shopping Cart</h1>
      <p class="mt-1 text-sm text-gray-400">Review your selected products before checkout</p>
    </div>

    <!-- Empty Cart -->
    <CartEmpty v-if="cartStore.items.length === 0" />

    <!-- Cart Content -->
    <div v-else class="grid gap-10 lg:grid-cols-3">
      <!-- Cart Items -->
      <section class="space-y-5 lg:col-span-2">
        <CartItem
          v-for="item in cartStore.items"
          :key="cartStore.getItemKey(item)"
          :item="item"
          @decrease="cartStore.decreaseQuantity"
          @increase="cartStore.increaseQuantity"
          @remove="cartStore.removeFromCart"
        />
      </section>

      <!-- Order Summary -->
      <CartSummary
        :total-items="cartStore.totalItems"
        :total-price="cartStore.totalPrice"
        @clear="cartStore.clearCart"
        @checkout="handleCheckout"
      />
    </div>
  </main>

  <Footer />
</template>
