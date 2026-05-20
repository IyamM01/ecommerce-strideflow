import api from './api'
import type { ApiPayload } from '@/types/api'
import type { Product, ProductPayload } from '@/types/product'

export const productService = {
  async getAll(): Promise<ApiPayload<Product[]>> {
    const response = await api.get<ApiPayload<Product[]>>('/products')
    return response.data
  },

  async getById(id: number): Promise<ApiPayload<Product>> {
    const response = await api.get<ApiPayload<Product>>(`/products/${id}`)
    return response.data
  },

  async create(payload: ProductPayload) {
    const formData = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value instanceof File ? value : String(value))
      }
    })

    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async update(id: number, payload: ProductPayload) {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value instanceof File ? value : String(value))
      }
    })

    const response = await api.post(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async delete(id: number) {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
}
