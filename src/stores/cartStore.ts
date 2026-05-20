import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { cartService } from '@/services/cartService'
import type { CartItem, CartProduct } from '@/types/cart'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(cartService.getCart())
  const getItemKey = (item: CartItem) => {
    return [item.product.id, item.color ?? 'default-color', item.size ?? 'default-size'].join(':')
  }

  const findCartItem = (productId: number, color?: string | null, size?: string | null) => {
    return items.value.find(
      (item) =>
        item.product.id === productId &&
        (item.color ?? null) === (color ?? null) &&
        (item.size ?? null) === (size ?? null),
    )
  }

  const saveCart = () => {
    cartService.saveCart(items.value)
  }

  const addToCart = (
    product: CartProduct,
    quantity: number = 1,
    color?: string | null,
    size?: string | null,
  ) => {
    const existingItem = findCartItem(product.id, color, size)

    if (existingItem) {
      if (product.stock && existingItem.quantity + quantity > product.stock) {
        existingItem.quantity = product.stock
      } else {
        existingItem.quantity += quantity
      }
    } else {
      items.value.push({
        product,
        quantity,
        color: color || undefined,
        size: size || undefined,
      })
    }

    saveCart()
  }

  const removeFromCart = (productId: number, color?: string | null, size?: string | null) => {
    items.value = items.value.filter(
      (item) =>
        !(
          item.product.id === productId &&
          (item.color ?? null) === (color ?? null) &&
          (item.size ?? null) === (size ?? null)
        ),
    )

    saveCart()
  }

  const increaseQuantity = (productId: number, color?: string | null, size?: string | null) => {
    const item = findCartItem(productId, color, size)

    if (!item) return

    if (item.product.stock && item.quantity >= item.product.stock) {
      return
    }

    item.quantity++
    saveCart()
  }

  const decreaseQuantity = (productId: number, color?: string | null, size?: string | null) => {
    const item = findCartItem(productId, color, size)

    if (!item) return

    if (item.quantity > 1) {
      item.quantity--
      saveCart()
    } else {
      removeFromCart(productId, color, size)
    }
  }

  const clearCart = () => {
    items.value = []
    cartService.clearCart()
  }

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  })

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getItemKey,
  }
})
