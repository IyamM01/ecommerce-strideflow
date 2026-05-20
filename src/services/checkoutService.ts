import api from './api'
import type { CheckoutPayload, XenditCheckoutResponse } from '@/types/payment'

export const checkoutService = {
  async createXenditInvoice(payload: CheckoutPayload): Promise<XenditCheckoutResponse> {
    const response = await api.post<XenditCheckoutResponse>('/checkout', payload)
    return response.data
  },

  async processCheckout(payload: CheckoutPayload): Promise<XenditCheckoutResponse> {
    const response = await api.post<XenditCheckoutResponse>('/checkout', payload)
    return response.data
  },
}
