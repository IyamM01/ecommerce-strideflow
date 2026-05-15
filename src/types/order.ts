import type { Product } from '@/types/product'
import type { User } from '@/types/user'

export interface OrderItem {
  id: number
  product_id: number
  product?: Product | null
  quantity: number
  price: number
  subtotal: number
}

export interface OrderPayment {
  id: number
  external_id: string
  provider: string
  invoice_id?: string | null
  payment_url?: string | null
  amount: number
  status: string
  paid_at?: string | null
}

export interface Order {
  id: number
  order_code: string
  total_price: number
  status: string
  user?: User | null
  items: OrderItem[]
  payment?: OrderPayment | null
  created_at: string
  updated_at: string
}

export interface OrderCollectionResponse {
  success: boolean
  message: string
  data: Order[]
}
