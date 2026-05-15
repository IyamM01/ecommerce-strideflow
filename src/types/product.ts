export interface ProductRelation {
  id: number
  name: string
  slug?: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  stock: number
  size?: string
  color?: string
  sku?: string
  image_url: string
  category_id: number
  category?: ProductRelation
  brand_id: number
  brand?: ProductRelation
  gender_id: number
  gender?: ProductRelation
  badge?: string
  created_at?: string
  updated_at?: string
}

export interface ProductPayload {
  name: string
  description: string
  price: number
  stock: number
  category_id: number
  brand_id: number
  gender_id: number
  sku?: string
  size?: string
  color?: string
  badge?: string
  image: File | null
}
