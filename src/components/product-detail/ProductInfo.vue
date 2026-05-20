<script setup lang="ts">
import { Star, Heart, ShoppingBag, Minus, Plus, ChevronDown } from '@lucide/vue'
import type { Product } from '@/types/product'

const props = defineProps<{
  product: Product
  selectedColor: string | null
  selectedSize: string | null
  quantity: number
  wishlist: boolean
  openSections: Record<string, boolean>
  uniqueSizes: string[]
  avgRating: number
  reviewCount: number
  ratingStars: string[]
}>()

const emit = defineEmits<{
  (e: 'update:selectedColor', val: string): void
  (e: 'update:selectedSize', val: string): void
  (e: 'update:quantity', val: number): void
  (e: 'update:wishlist', val: boolean): void
  (e: 'toggleSection', key: string): void
  (e: 'addToCart'): void
  (e: 'buyNow'): void
}>()

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)

const decreaseQty = () => {
  if (props.quantity > 1) emit('update:quantity', props.quantity - 1)
}
const increaseQty = () => emit('update:quantity', props.quantity + 1)
</script>

<template>
  <div class="col-span-1 lg:col-span-5 flex flex-col pt-2">
    <!-- Brand & Name -->
    <div class="mb-6">
      <p
        v-if="product.brand"
        class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2"
      >
        {{ product.brand.name }}
      </p>
      <h1 class="text-3xl font-bold text-black leading-tight mb-4">{{ product.name }}</h1>

      <!-- Rating -->
      <div class="flex items-center gap-3 mb-4">
        <div class="flex items-center text-black gap-0.5">
          <template v-for="(star, i) in ratingStars" :key="i">
            <Star
              :size="16"
              :fill="star !== 'empty' ? 'currentColor' : 'none'"
              :class="star === 'empty' ? 'text-gray-300' : 'text-black'"
            />
          </template>
        </div>
        <span class="text-sm font-bold text-black">{{
          avgRating > 0 ? avgRating.toFixed(1) : '-'
        }}</span>
        <span class="text-xs font-semibold text-gray-400">
          {{ reviewCount }} {{ reviewCount === 1 ? 'Review' : 'Reviews' }}
        </span>
      </div>

      <div class="text-2xl font-extrabold text-black">{{ formatPrice(product.price) }}</div>
    </div>

    <!-- Description -->
    <p class="text-sm text-gray-500 leading-relaxed mb-8">{{ product.description }}</p>

    <!-- Color -->
    <div v-if="product.color" class="mb-6">
      <div class="flex justify-between items-center mb-3">
        <span class="text-xs font-bold uppercase tracking-widest text-black">Color</span>
        <span class="text-sm text-gray-400">{{ selectedColor }}</span>
      </div>
      <div class="flex gap-3">
        <button
          @click="emit('update:selectedColor', product.color!)"
          class="px-5 py-2 rounded-full border text-xs font-semibold transition-all duration-200"
          :class="
            selectedColor === product.color
              ? 'bg-black text-white border-black'
              : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'
          "
        >
          {{ product.color }}
        </button>
      </div>
    </div>

    <!-- Size -->
    <div v-if="uniqueSizes.length > 0" class="mb-8">
      <div class="flex justify-between items-center mb-3">
        <span class="text-xs font-bold uppercase tracking-widest text-black">Size</span>
        <a
          href="#"
          class="text-xs font-semibold text-gray-400 hover:text-black underline underline-offset-4 transition-colors"
          >Size Guide</a
        >
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="size in uniqueSizes"
          :key="size"
          @click="emit('update:selectedSize', size)"
          class="px-5 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200"
          :class="
            selectedSize === size
              ? 'bg-black text-white border-black shadow-md'
              : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'
          "
        >
          {{ size }}
        </button>
      </div>
    </div>

    <!-- Quantity & Actions -->
    <div class="flex flex-col gap-3 mb-8">
      <div class="flex gap-3">
        <!-- Quantity -->
        <div
          class="flex items-center justify-between border border-gray-200 rounded-xl bg-white h-12 px-2 w-32"
        >
          <button @click="decreaseQty" class="p-2 text-gray-400 hover:text-black transition-colors">
            <Minus :size="16" />
          </button>
          <span class="text-sm font-bold text-black">{{ quantity }}</span>
          <button @click="increaseQty" class="p-2 text-gray-400 hover:text-black transition-colors">
            <Plus :size="16" />
          </button>
        </div>

        <!-- Add to Cart -->
        <button
          @click="emit('addToCart')"
          class="flex-1 h-12 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-black/10 flex items-center justify-center gap-2"
        >
          <ShoppingBag :size="18" />
          Add to Cart
        </button>
      </div>

      <!-- Buy Now -->
      <button
        @click="emit('buyNow')"
        class="w-full h-12 bg-white text-black border-2 border-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center"
      >
        Buy Now
      </button>

      <!-- Wishlist -->
      <button
        @click="emit('update:wishlist', !wishlist)"
        class="w-full py-3 flex items-center justify-center gap-2 text-gray-400 hover:text-black transition-colors text-xs font-semibold uppercase tracking-wider"
      >
        <Heart
          :size="16"
          :fill="wishlist ? 'currentColor' : 'none'"
          :class="wishlist ? 'text-red-500' : ''"
        />
        {{ wishlist ? 'Wishlisted' : 'Add to Wishlist' }}
      </button>
    </div>

    <!-- Accordion -->
    <div class="border-t border-gray-100 mt-auto">
      <!-- Description -->
      <div class="border-b border-gray-100">
        <button
          @click="emit('toggleSection', 'description')"
          class="w-full flex justify-between items-center py-4 text-sm font-semibold text-black text-left"
        >
          Description
          <ChevronDown
            :size="18"
            class="text-gray-400 transition-transform duration-300"
            :class="openSections.description ? 'rotate-180' : ''"
          />
        </button>
        <div
          v-if="openSections.description"
          class="pb-4 text-sm text-gray-500 leading-relaxed space-y-2"
        >
          <p>{{ product.description }}</p>
          <ul class="list-disc pl-5 space-y-1 text-xs">
            <li>Premium quality materials</li>
            <li>Designed for comfort and style</li>
            <li>Durable construction</li>
          </ul>
        </div>
      </div>

      <!-- Details & Fit -->
      <div class="border-b border-gray-100">
        <button
          @click="emit('toggleSection', 'details')"
          class="w-full flex justify-between items-center py-4 text-sm font-semibold text-black text-left"
        >
          Details & Fit
          <ChevronDown
            :size="18"
            class="text-gray-400 transition-transform duration-300"
            :class="openSections.details ? 'rotate-180' : ''"
          />
        </button>
        <div v-if="openSections.details" class="pb-4 text-sm text-gray-500 leading-relaxed">
          <p>Relaxed, true-to-size fit. See size guide for detailed measurements.</p>
          <p v-if="product.sku" class="mt-2 text-xs text-gray-400">SKU: {{ product.sku }}</p>
          <p v-if="product.stock" class="mt-1 text-xs text-gray-400">
            {{ product.stock }} units in stock
          </p>
        </div>
      </div>

      <!-- Shipping -->
      <div>
        <button
          @click="emit('toggleSection', 'shipping')"
          class="w-full flex justify-between items-center py-4 text-sm font-semibold text-black text-left"
        >
          Shipping & Returns
          <ChevronDown
            :size="18"
            class="text-gray-400 transition-transform duration-300"
            :class="openSections.shipping ? 'rotate-180' : ''"
          />
        </button>
        <div v-if="openSections.shipping" class="pb-4 text-sm text-gray-500 leading-relaxed">
          <p>
            Free standard shipping on orders over Rp 500.000. Returns accepted within 30 days in
            original condition.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
