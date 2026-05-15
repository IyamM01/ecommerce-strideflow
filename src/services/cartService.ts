import type { CartItem } from '@/types/cart'

const CART_KEY = 'cart'

export const cartService = {
  getCart(): CartItem[] {
    const savedCart = localStorage.getItem(CART_KEY)

    if (!savedCart) {
      return []
    }

    try {
      return JSON.parse(savedCart)
    } catch (error) {
      console.error('Failed to parse cart data:', error)
      return []
    }
  },

  saveCart(items: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  },

  clearCart(): void {
    localStorage.removeItem(CART_KEY)
  },
}
