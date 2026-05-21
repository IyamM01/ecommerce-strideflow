import { computed, onScopeDispose, ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'

import { productService } from '@/services/productService'
import { reviewService, type Review } from '@/services/reviewService'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import type { Product } from '@/types/product'
import { getApiErrorMessage, unwrapCollection, unwrapResource } from '@/utils/apiResponse'

type ProductRouteParam = string | string[] | undefined
type DetailSectionKey = 'description' | 'details' | 'shipping'

const PRODUCT_PLACEHOLDER_IMAGE = 'https://placehold.co/700x875?text=No+Image'
const RELATED_PRODUCTS_LIMIT = 4
const MAX_RATING = 5
const CART_FEEDBACK_DURATION = 1800

const normalizeProductId = (value: ProductRouteParam) => {
  const rawValue = Array.isArray(value) ? value[0] : value
  const id = Number(rawValue)

  return Number.isFinite(id) ? id : null
}

const buildRatingStars = (rating: number) => {
  const stars: Array<'full' | 'half' | 'empty'> = []
  const floor = Math.floor(rating)
  const fraction = rating - floor
  const hasHalf = fraction >= 0.25 && fraction < 0.75
  const fullStars = hasHalf ? floor : fraction >= 0.75 ? floor + 1 : floor

  for (let index = 1; index <= MAX_RATING; index += 1) {
    if (index <= fullStars) {
      stars.push('full')
    } else if (index === fullStars + 1 && hasHalf) {
      stars.push('half')
    } else {
      stars.push('empty')
    }
  }

  return stars
}

const createCartProduct = (product: Product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  image_url: product.image_url,
  stock: product.stock,
  brand: product.brand,
})

const createInitialSections = (): Record<DetailSectionKey, boolean> => ({
  description: true,
  details: false,
  shipping: false,
})

/**
 * Keeps the product detail page focused on rendering by handling product loading,
 * variant selection, cart actions, reviews, rating display, and related products.
 */
export const useProductDetailPage = (productIdParam: Ref<ProductRouteParam>) => {
  const router = useRouter()
  const authStore = useAuthStore()
  const cartStore = useCartStore()

  const product = ref<Product | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const relatedProducts = ref<Product[]>([])

  const selectedImage = ref(0)
  const selectedColor = ref<string | null>(null)
  const selectedSize = ref<string | null>(null)
  const quantity = ref(1)
  const wishlist = ref(false)
  const openSections = ref(createInitialSections())
  const cartFeedbackVisible = ref(false)

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

  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const thumbnails = computed(() => {
    const url = product.value?.image_url || PRODUCT_PLACEHOLDER_IMAGE
    return [url, url, url, url]
  })
  const uniqueSizes = computed(() => {
    if (!product.value?.size) return []

    return product.value.size
      .split(',')
      .map((size) => size.trim())
      .filter(Boolean)
  })
  const ratingStars = computed(() => buildRatingStars(avgRating.value))
  let cartFeedbackTimeout: ReturnType<typeof setTimeout> | null = null

  const hideCartFeedback = () => {
    cartFeedbackVisible.value = false

    if (cartFeedbackTimeout) {
      clearTimeout(cartFeedbackTimeout)
      cartFeedbackTimeout = null
    }
  }

  const showCartFeedback = () => {
    if (cartFeedbackTimeout) clearTimeout(cartFeedbackTimeout)

    cartFeedbackVisible.value = true
    cartFeedbackTimeout = setTimeout(() => {
      cartFeedbackVisible.value = false
      cartFeedbackTimeout = null
    }, CART_FEEDBACK_DURATION)
  }

  const resetProductState = () => {
    selectedImage.value = 0
    selectedColor.value = null
    selectedSize.value = null
    quantity.value = 1
    submitSuccess.value = false
    submitError.value = null
    newRating.value = 0
    newComment.value = ''
    hoverRating.value = 0
    openSections.value = createInitialSections()
    hideCartFeedback()
  }

  const applyDefaultSelections = () => {
    selectedColor.value = product.value?.color ?? null
    selectedSize.value = uniqueSizes.value[0] ?? null
  }

  const toggleSection = (key: string) => {
    if (!(key in openSections.value)) return

    openSections.value[key as DetailSectionKey] = !openSections.value[key as DetailSectionKey]
  }

  const fetchReviews = async (productId: number) => {
    reviewsLoading.value = true

    try {
      const response = await reviewService.getByProduct(productId)

      reviews.value = response.data
      avgRating.value = response.avg_rating
      reviewCount.value = response.review_count
    } catch {
      reviews.value = []
      avgRating.value = 0
      reviewCount.value = 0
    } finally {
      reviewsLoading.value = false
    }
  }

  const fetchRelatedProducts = async (currentProductId: number) => {
    try {
      const response = await productService.getAll()
      const products = unwrapCollection<Product>(response)

      relatedProducts.value = products
        .filter((item) => item.id !== currentProductId)
        .slice(0, RELATED_PRODUCTS_LIMIT)
    } catch {
      relatedProducts.value = []
    }
  }

  const fetchProduct = async (productId: number) => {
    loading.value = true
    error.value = null
    resetProductState()

    try {
      const response = await productService.getById(productId)

      product.value = unwrapResource<Product | null>(response, null)
      applyDefaultSelections()

      await Promise.all([fetchRelatedProducts(productId), fetchReviews(productId)])
    } catch (err) {
      product.value = null
      relatedProducts.value = []
      error.value = getApiErrorMessage(err, 'Product not found')
    } finally {
      loading.value = false
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
    } catch (err) {
      submitError.value = getApiErrorMessage(err, 'Failed to submit review')
    } finally {
      submitLoading.value = false
    }
  }

  const addSelectedProductToCart = () => {
    if (!product.value) return

    cartStore.addToCart(
      createCartProduct(product.value),
      quantity.value,
      selectedColor.value,
      selectedSize.value,
    )
  }

  const requireLogin = (redirect: string) => {
    if (isLoggedIn.value) return false

    router.push({
      path: '/auth/login',
      query: { redirect },
    })

    return true
  }

  const handleAddToCart = () => {
    if (!product.value || requireLogin(router.currentRoute.value.fullPath)) return

    addSelectedProductToCart()
    showCartFeedback()
  }

  const handleBuyNow = () => {
    if (!product.value || requireLogin('/checkout')) return

    addSelectedProductToCart()
    router.push('/checkout')
  }

  const goBack = () => {
    router.back()
  }

  watch(
    productIdParam,
    (value) => {
      const productId = normalizeProductId(value)

      if (productId === null) {
        loading.value = false
        product.value = null
        error.value = 'Product not found'
        return
      }

      void fetchProduct(productId)
    },
    { immediate: true },
  )

  onScopeDispose(hideCartFeedback)

  return {
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
  }
}
