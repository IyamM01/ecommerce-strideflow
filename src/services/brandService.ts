import api from './api'
import type { ApiPayload } from '@/types/api'
import type { ProductRelation } from '@/types/product'

export const brandService = {
  async getAll(): Promise<ApiPayload<ProductRelation[]>> {
    const response = await api.get<ApiPayload<ProductRelation[]>>('/brands')
    return response.data
  },
}
