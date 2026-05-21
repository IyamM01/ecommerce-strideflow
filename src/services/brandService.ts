import api from './api'
import type { ApiPayload } from '@/types/api'
import type { ProductRelation } from '@/types/product'

export const brandService = {
  async getAll(): Promise<ApiPayload<ProductRelation[]>> {
    const response = await api.get<ApiPayload<ProductRelation[]>>('/brands')
    return response.data
  },

  async create(payload: { name: string }): Promise<ApiPayload<ProductRelation>> {
    const response = await api.post<ApiPayload<ProductRelation>>('/brands', payload)
    return response.data
  },

  async update(id: number, payload: { name: string }): Promise<ApiPayload<ProductRelation>> {
    const response = await api.put<ApiPayload<ProductRelation>>(`/brands/${id}`, payload)
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/brands/${id}`)
    return response.data
  },
}
