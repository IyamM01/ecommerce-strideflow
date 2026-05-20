import { defineStore } from 'pinia'
import { productService } from '@/services/productService'
import type { Product, ProductPayload } from '@/types/product'
import {
  getApiErrorMessage,
  getValidationErrors,
  unwrapCollection,
  unwrapResource,
} from '@/utils/apiResponse'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    product: null as Product | null,
    loading: false,
    error: null as string | null,
    validationErrors: {} as Record<string, string[]>,
    selectedCategory: 'all' as string | number,
    selectedBrand: 'all' as string | number,
    selectedSize: 'all' as string,
    selectedColor: 'all' as string,
    selectedGender: 'all' as string,
    selectedMaxPrice: null as number | null,
    searchQuery: '',
  }),

  getters: {
    filteredProducts: (state) => {
      return state.products.filter((product) => {
        const keyword = state.searchQuery.trim().toLowerCase()
        const searchableText = [
          product.name,
          product.description,
          product.brand?.name,
          product.category?.name,
          product.gender?.name,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        const matchSearch = !keyword || searchableText.includes(keyword)

        const pCategoryId = product.category_id ?? product.category?.id
        const matchCategory =
          state.selectedCategory === 'all' || pCategoryId === state.selectedCategory

        const pBrandId = product.brand_id ?? product.brand?.id
        const matchBrand = state.selectedBrand === 'all' || pBrandId === state.selectedBrand

        const matchPrice =
          state.selectedMaxPrice === null || product.price <= state.selectedMaxPrice

        // Gender filter: match by gender relation name (case-insensitive)
        const pGenderName = product.gender?.name?.toLowerCase() ?? ''
        const matchGender =
          state.selectedGender === 'all' || pGenderName === state.selectedGender.toLowerCase()

        let matchSizeAndColor = true
        if (state.selectedSize !== 'all' || state.selectedColor !== 'all') {
          const sizeMatch = state.selectedSize === 'all' || product.size === state.selectedSize
          const colorMatch = state.selectedColor === 'all' || product.color === state.selectedColor
          matchSizeAndColor = sizeMatch && colorMatch
        }

        return (
          matchSearch &&
          matchCategory &&
          matchBrand &&
          matchPrice &&
          matchGender &&
          matchSizeAndColor
        )
      })
    },
  },

  actions: {
    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    setMaxPrice(price: number | null) {
      this.selectedMaxPrice = price
    },

    resetFilters() {
      this.selectedCategory = 'all'
      this.selectedBrand = 'all'
      this.selectedSize = 'all'
      this.selectedColor = 'all'
      this.selectedGender = 'all'
      this.selectedMaxPrice = null
      this.searchQuery = ''
    },

    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const data = await productService.getAll()
        this.products = unwrapCollection<Product>(data)
      } catch (error) {
        this.error = getApiErrorMessage(error, 'Gagal mengambil data product')
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(id: number) {
      this.loading = true
      this.error = null

      try {
        const data = await productService.getById(id)
        this.product = unwrapResource<Product | null>(data, null)
      } catch (error) {
        this.error = getApiErrorMessage(error, 'Gagal mengambil detail product')
      } finally {
        this.loading = false
      }
    },

    async createProduct(payload: ProductPayload) {
      this.loading = true
      this.error = null
      this.validationErrors = {}

      try {
        await productService.create(payload)
        await this.fetchProducts()
      } catch (error) {
        this.validationErrors = getValidationErrors(error)
        this.error = getApiErrorMessage(error, 'Gagal menambahkan product')
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id: number, payload: ProductPayload) {
      this.loading = true
      this.error = null
      this.validationErrors = {}

      try {
        await productService.update(id, payload)
        await this.fetchProducts()
      } catch (error) {
        this.validationErrors = getValidationErrors(error)
        this.error = getApiErrorMessage(error, 'Gagal mengupdate product')
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id: number) {
      this.loading = true
      this.error = null

      try {
        await productService.delete(id)
        this.products = this.products.filter((product) => product.id !== id)
      } catch (error) {
        this.error = getApiErrorMessage(error, 'Gagal menghapus product')
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
