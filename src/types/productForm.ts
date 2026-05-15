import type { ProductRelation } from '@/types/product'

export interface ProductFormValues {
  name: string
  description: string
  price: number | null
  stock: number | null
  category_id: number | null
  brand_id: number | null
  gender_id: number | null
  sku: string
  size: string
  color: string
  badge: string
  image_url: string
}

export interface ProductFormProps {
  title: string
  description: string
  submitLabel: string
  loading?: boolean
  errors?: Record<string, string[]>
  initialValues?: Partial<ProductFormValues>
  requireImage?: boolean
}

export interface SelectOption extends ProductRelation {}
