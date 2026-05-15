<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronRight, ArrowLeft } from '@lucide/vue'

import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import ProductGallery from '@/components/product-detail/ProductGallery.vue'
import ProductInfo from '@/components/product-detail/ProductInfo.vue'
import ProductReviews from '@/components/product-detail/ProductReviews.vue'
import ProductRelated from '@/components/product-detail/ProductRelated.vue'

import { productService } from '@/services/productService'
import { reviewService } from '@/services/reviewService'
import type { Review } from '@/services/reviewService'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import type { Product } from '@/types/product'

// ─── Router & Auth ────────────────────────────────────────
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

// ─── Product State ────────────────────────────────────────
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const relatedProducts = ref<Product[]>([])

// ─── Gallery ──────────────────────────────────────────────
const selectedImage = ref(0)
const thumbnails = computed(() => {
  const url = product.value?.image_url || 'https://placehold.co/700x875?text=No+Image'
  return [url, url, url, url]
})

// ─── Info Panel ───────────────────────────────────────────
const selectedColor = ref<string | null>(null)
const selectedSize = ref<string | null>(null)
const quantity = ref(1)
const wishlist = ref(false)
const openSections = ref<Record<string, boolean>>({
  description: true,
  details: false,
  shipping: false,
})
const uniqueSizes = computed(() => {
  if (!product.value?.size) return []
  return product.value.size.split(',').map(s => s.trim()).filter(Boolean)
})
const toggleSection = (key: string) => {
  openSections.value[key] = !openSections.value[key]
}

// ─── Reviews ──────────────────────────────────────────────
const reviews = ref<Review[]>([])
const avgRating = ref(0)
const reviewCount = ref(0)
const reviewsLoading = ref(false)
const submitLoading = ref(false)
const submitError = ref<string | null>(null)
const submitSuccess = ref(false)
const newRating = ref(0)
const newComment = ref('')
const hoverRating = ref(0)

const ratingStars = computed(() => {
  const stars: string[] = []
  const floor = Math.floor(avgRating.value)
  const frac = avgRating.value - floor
  const hasHalf = frac >= 0.25 && frac < 0.75
  const full = hasHalf ? floor : frac >= 0.75 ? floor + 1 : floor
  for (let i = 1; i <= 5; i++) {
    if (i <= full) stars.push('full')
    else if (i === full + 1 && hasHalf) stars.push('half')
    else stars.push('empty')
  }
  return stars
})

const fetchReviews = async (productId: number) => {
  reviewsLoading.value = true
  try {
    const res = await reviewService.getByProduct(productId)
    reviews.value = res.data
    avgRating.value = res.avg_rating
    reviewCount.value = res.review_count
  } catch {
    // silently fail
  } finally {
    reviewsLoading.value = false
  }
}

const submitReview = async () => {
  if (!product.value || newRating.value === 0) return
  submitLoading.value = true
  submitError.value = null
  try {
    await reviewService.submit(product.value.id, {
      rating: newRating.value,
      comment: newComment.value,
    })
    submitSuccess.value = true
    newRating.value = 0
    newComment.value = ''
    await fetchReviews(product.value.id)
  } catch (err: any) {
    submitError.value = err.response?.data?.message || 'Failed to submit review'
  } finally {
    submitLoading.value = false
  }
}

// ─── Cart Actions ─────────────────────────────────────────
const handleAddToCart = () => {
  if (!product.value) return

  if (!authStore.isLoggedIn) {
    router.push({
      path: '/auth/login',
      query: { redirect: '/cart' },
    })
    return
  }
  
  cartStore.addToCart(
    {
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image_url: product.value.image_url,
      stock: product.value.stock,
      brand: product.value.brand,
    },
    quantity.value,
    selectedColor.value,
    selectedSize.value
  )

  router.push('/cart')
}

const handleBuyNow = () => {
  if (!product.value) return

  if (!authStore.isLoggedIn) {
    router.push({
      path: '/auth/login',
      query: { redirect: '/checkout' },
    })
    return
  }
  
  cartStore.addToCart(
    {
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image_url: product.value.image_url,
      stock: product.value.stock,
      brand: product.value.brand,
    },
    quantity.value,
    selectedColor.value,
    selectedSize.value
  )

  router.push('/checkout')
}

// ─── Data Fetching ────────────────────────────────────────
const fetchProduct = async (id: number) => {
  loading.value = true
  error.value = null
  try {
    const data = await productService.getById(id)
    product.value = (data as any).data ?? data
    if (product.value?.color) selectedColor.value = product.value.color ?? null
    if (uniqueSizes.value.length > 0) selectedSize.value = uniqueSizes.value[0] ?? null
    await Promise.all([fetchRelated(), fetchReviews(id)])
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Product not found'
  } finally {
    loading.value = false
  }
}

const fetchRelated = async () => {
  try {
    const data = await productService.getAll()
    const all: Product[] = (data as any).data ?? data
    relatedProducts.value = all.filter(p => p.id !== product.value?.id).slice(0, 4)
  } catch {
    relatedProducts.value = []
  }
}

onMounted(() => {
  const id = Number(route.params.id)
  if (!isNaN(id)) fetchProduct(id)
})

watch(() => route.params.id, (newId) => {
  const id = Number(newId)
  if (!isNaN(id)) {
    selectedImage.value = 0
    submitSuccess.value = false
    fetchProduct(id)
  }
})
</script>

<template>
  <NavBar />

  <main class="min-h-screen bg-white">

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-[60vh]">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-4">
      <p class="text-gray-500 text-lg">{{ error }}</p>
      <button @click="router.back()" class="flex items-center gap-2 text-sm font-semibold underline underline-offset-4">
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
          :is-logged-in="authStore.isLoggedIn"
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
