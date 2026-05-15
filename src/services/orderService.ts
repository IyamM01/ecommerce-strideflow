import api from './api'
import type { Order, OrderCollectionResponse } from '@/types/order'

export const orderService = {
  async getAll(): Promise<OrderCollectionResponse> {
    const response = await api.get<OrderCollectionResponse>('/orders')
    return response.data
  },

  async getById(id: number): Promise<Order> {
    const response = await api.get(`/orders/${id}`)
    return response.data.data ?? response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/orders/${id}`)
    return response.data
  },
}
