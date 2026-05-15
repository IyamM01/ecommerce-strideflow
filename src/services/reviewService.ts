import api from './api'

export interface Review {
  id: number
  rating: number
  comment: string | null
  user: { id: number; name: string }
  created_at: string
}

export interface ReviewsResponse {
  status: boolean
  avg_rating: number
  review_count: number
  data: Review[]
}

export const reviewService = {
  async getByProduct(productId: number): Promise<ReviewsResponse> {
    const response = await api.get(`/products/${productId}/reviews`)
    return response.data
  },

  async submit(productId: number, payload: { rating: number; comment: string }): Promise<Review> {
    const response = await api.post(`/products/${productId}/reviews`, payload)
    return response.data
  },
}
