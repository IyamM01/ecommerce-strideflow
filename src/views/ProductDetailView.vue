<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Check, ChevronRight, ShoppingCart } from '@lucide/vue'

import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import ProductGallery from '@/components/product-detail/ProductGallery.vue'
import ProductInfo from '@/components/product-detail/ProductInfo.vue'
import ProductReviews from '@/components/product-detail/ProductReviews.vue'
import ProductRelated from '@/components/product-detail/ProductRelated.vue'

import { useProductDetailPage } from '@/composables/useProductDetailPage'

const route = useRoute()
const productIdParam = computed(() => route.params.id)

const {
  avgRating,
  cartFeedbackVisible,
  error,
  goBack,
  handleAddToCart,
  handleBuyNow,
  hoverRating,
  isLoggedIn,
  loading,
  newComment,
  newRating,
  openSections,
  product,
  quantity,
  ratingStars,
  relatedProducts,
  reviewCount,
  reviews,
  reviewsLoading,
  selectedColor,
  selectedImage,
  selectedSize,
  submitError,
  submitLoading,
  submitReview,
  submitSuccess,
  thumbnails,
  toggleSection,
  uniqueSizes,
  wishlist,
} = useProductDetailPage(productIdParam)
</script>

<template>
  <NavBar />

  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="-translate-y-6 opacity-0 scale-95"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100 scale-100"
    leave-to-class="-translate-y-6 opacity-0 scale-95"
  >
    <div
      v-if="cartFeedbackVisible"
      class="fixed left-1/2 top-24 z-[70] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-2xl shadow-black/10"
    >
      <div class="flex min-w-0 items-center gap-3">
        <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Check class="h-5 w-5" stroke-width="3" />
        </span>
        <div class="min-w-0">
          <p class="text-sm font-bold text-gray-950">Added to cart</p>
          <p class="truncate text-xs font-medium text-gray-500">{{ product?.name }}</p>
        </div>
      </div>

      <RouterLink
        to="/cart"
        class="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800"
        aria-label="Open cart"
      >
        <ShoppingCart class="h-4 w-4" stroke-width="2.5" />
      </RouterLink>
    </div>
  </Transition>

  <main class="min-h-screen bg-white">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-[60vh]">
      <div
        class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"
      ></div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-4"
    >
      <p class="text-gray-500 text-lg">{{ error }}</p>
      <button
        @click="goBack"
        class="flex items-center gap-2 text-sm font-semibold underline underline-offset-4"
      >
        <ArrowLeft :size="16" /> Go Back
      </button>
    </div>

    <!-- Content -->
    <template v-else-if="product">
      <div class="mx-auto max-w-[1440px] px-6 py-10 lg:px-12">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-10 flex-wrap">
          <RouterLink to="/" class="hover:text-black transition-colors">Home</RouterLink>
          <ChevronRight :size="14" />
          <RouterLink to="/men" class="hover:text-black transition-colors">Shop</RouterLink>
          <ChevronRight :size="14" />
          <span v-if="product.category">{{ product.category.name }}</span>
          <ChevronRight :size="14" v-if="product.category" />
          <span class="text-black">{{ product.name }}</span>
        </nav>

        <!-- Main Grid: Gallery + Info -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          <ProductGallery
            :images="thumbnails"
            :selected-index="selectedImage"
            :badge="product.badge"
            :stock="product.stock"
            :product-name="product.name"
            @select="selectedImage = $event"
          />

          <ProductInfo
            :product="product"
            :selected-color="selectedColor"
            :selected-size="selectedSize"
            :quantity="quantity"
            :wishlist="wishlist"
            :open-sections="openSections"
            :unique-sizes="uniqueSizes"
            :avg-rating="avgRating"
            :review-count="reviewCount"
            :rating-stars="ratingStars"
            @update:selected-color="selectedColor = $event"
            @update:selected-size="selectedSize = $event"
            @update:quantity="quantity = $event"
            @update:wishlist="wishlist = $event"
            @toggle-section="toggleSection"
            @add-to-cart="handleAddToCart"
            @buy-now="handleBuyNow"
          />
        </div>

        <!-- Reviews -->
        <ProductReviews
          :avg-rating="avgRating"
          :review-count="reviewCount"
          :rating-stars="ratingStars"
          :reviews="reviews"
          :reviews-loading="reviewsLoading"
          :submit-loading="submitLoading"
          :submit-success="submitSuccess"
          :submit-error="submitError"
          :is-logged-in="isLoggedIn"
          :new-rating="newRating"
          :new-comment="newComment"
          :hover-rating="hoverRating"
          @update:new-rating="newRating = $event"
          @update:new-comment="newComment = $event"
          @update:hover-rating="hoverRating = $event"
          @submit="submitReview"
        />

        <!-- Related -->
        <ProductRelated :products="relatedProducts" />
      </div>
    </template>
  </main>

  <Footer />
</template>
