import api from './api'

export interface CheckoutPayload {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  items: {
    product_id: number
    quantity: number
    price: number
  }[]
}

export const checkoutService = {
  async processCheckout(payload: CheckoutPayload) {
    const response = await api.post('/checkout', payload)
    return response.data
  },
}
