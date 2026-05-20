import api from './api'
import type { ApiPayload } from '@/types/api'
import type { ProductRelation } from '@/types/product'

export const genderService = {
  async getAll(): Promise<ApiPayload<ProductRelation[]>> {
    const response = await api.get<ApiPayload<ProductRelation[]>>('/genders')
    return response.data
  },
}
