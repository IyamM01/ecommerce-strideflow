<script setup lang="ts">
import { computed, onScopeDispose, ref } from 'vue'
import { Check, ShoppingCart } from '@lucide/vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type { Product } from '@/types/product'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'

const props = defineProps<{
  product: Product
}>()

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()
const addedToCart = ref(false)
let feedbackTimeout: ReturnType<typeof setTimeout> | null = null

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

const imageUrl = computed(() => {
  return props.product.image_url || 'https://placehold.co/400x500?text=No+Image'
})

const productSubtitle = computed(() => {
  return props.product.brand?.name || ''
})

const showAddedFeedback = () => {
  if (feedbackTimeout) clearTimeout(feedbackTimeout)

  addedToCart.value = true
  feedbackTimeout = setTimeout(() => {
    addedToCart.value = false
  }, 1400)
}

const handleAddToCart = () => {
  if (!authStore.isLoggedIn) {
    router.push({
      path: '/auth/login',
      query: { redirect: route.fullPath },
    })
    return
  }

  cartStore.addToCart({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    image_url: props.product.image_url,
    stock: props.product.stock,
    brand: props.product.brand,
  })

  showAddedFeedback()
}

onScopeDispose(() => {
  if (feedbackTimeout) clearTimeout(feedbackTimeout)
})
</script>

<template>
  <div class="group relative flex flex-col transition-all duration-300">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-y-6 scale-95 opacity-0"
      enter-to-class="translate-y-0 scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 scale-100 opacity-100"
      leave-to-class="-translate-y-6 scale-95 opacity-0"
    >
      <div
        v-if="addedToCart"
        class="fixed left-1/2 top-24 z-[70] inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xl shadow-emerald-600/20"
      >
        <Check :size="15" stroke-width="3" />
        Added to cart
      </div>
    </Transition>
    <!-- Image Container — clickable -->
    <RouterLink :to="`/products/${product.id}`" class="block">
      <div class="relative aspect-4/5 overflow-hidden rounded-2xl bg-[#F6F6F6]">
        <div
          v-if="product.badge"
          class="absolute top-3 left-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-sm backdrop-blur-sm"
        >
          {{ product.badge }}
        </div>

        <img
          :src="imageUrl"
          :alt="product.name"
          class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <!-- Quick View Overlay -->
        <div
          class="absolute inset-0 flex items-end justify-center bg-black/0 pb-4 opacity-0 transition-all duration-300 group-hover:bg-black/5 group-hover:opacity-100"
        >
          <span
            class="rounded-full bg-black/70 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-sm"
          >
            Quick View
          </span>
        </div>
      </div>
    </RouterLink>

    <!-- Product Info -->
    <div class="mt-3 flex flex-col px-0.5">
      <div class="flex flex-col gap-1">
        <RouterLink :to="`/products/${product.id}`" class="block">
          <h3
            class="line-clamp-2 text-sm font-bold leading-tight text-[#1A1A1A] transition-colors hover:text-gray-600"
          >
            {{ product.name }}
          </h3>
        </RouterLink>

        <p v-if="productSubtitle" class="line-clamp-1 text-xs font-medium text-gray-400">
          {{ productSubtitle }}
        </p>
      </div>

      <div class="mt-3 flex items-center justify-between">
        <span class="text-base font-extrabold text-[#1A1A1A]">
          {{ formatPrice(product.price) }}
        </span>

        <button
          class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black text-white shadow-md shadow-black/10 transition-all duration-300 hover:scale-110 hover:bg-gray-800 active:scale-95"
          :class="addedToCart ? 'scale-110 bg-emerald-600 hover:bg-emerald-600' : ''"
          aria-label="Add to cart"
          @click.prevent="handleAddToCart"
        >
          <Check v-if="addedToCart" :size="16" stroke-width="3" />
          <ShoppingCart v-else :size="16" stroke-width="2.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
