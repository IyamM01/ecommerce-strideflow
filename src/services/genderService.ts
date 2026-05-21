import api from './api'
import type { ApiPayload } from '@/types/api'
import type { ProductRelation } from '@/types/product'

export const genderService = {
  async getAll(): Promise<ApiPayload<ProductRelation[]>> {
    const response = await api.get<ApiPayload<ProductRelation[]>>('/genders')
    return response.data
  },

  async create(payload: { name: string }): Promise<ApiPayload<ProductRelation>> {
    const response = await api.post<ApiPayload<ProductRelation>>('/genders', payload)
    return response.data
  },

  async update(id: number, payload: { name: string }): Promise<ApiPayload<ProductRelation>> {
    const response = await api.put<ApiPayload<ProductRelation>>(`/genders/${id}`, payload)
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/genders/${id}`)
    return response.data
  },
}
