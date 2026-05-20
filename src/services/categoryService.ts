import api from './api'
import type { ApiPayload } from '@/types/api'
import type { Category } from '@/types/category'

export const categoryService = {
  async getAll(): Promise<ApiPayload<Category[]>> {
    const response = await api.get<ApiPayload<Category[]>>('/categories')
    return response.data
  },
}
