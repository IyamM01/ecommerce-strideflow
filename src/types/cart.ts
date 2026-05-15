import type { Product } from '@/types/product'

export interface CartProduct {
  id: number
  name: string
  price: number
  image_url?: string
  stock?: number
  brand?: Product['brand']
}

export interface CartItem {
  product: CartProduct
  quantity: number
  color?: string
  size?: string
}
