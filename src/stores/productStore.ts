import { defineStore } from 'pinia'
import { productService } from '@/services/productService'
import type { Product, ProductPayload } from '@/types/product'

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
  }),

  getters: {
    filteredProducts: (state) => {
      return state.products.filter(product => {
        const pCategoryId = product.category_id ?? product.category?.id
        const matchCategory = state.selectedCategory === 'all' || pCategoryId === state.selectedCategory

        const pBrandId = product.brand_id ?? product.brand?.id
        const matchBrand = state.selectedBrand === 'all' || pBrandId === state.selectedBrand

        // Gender filter: match by gender relation name (case-insensitive)
        const pGenderName = product.gender?.name?.toLowerCase() ?? ''
        const matchGender = state.selectedGender === 'all' ||
          pGenderName === state.selectedGender.toLowerCase()

        let matchSizeAndColor = true
        if (state.selectedSize !== 'all' || state.selectedColor !== 'all') {
          const sizeMatch = state.selectedSize === 'all' || product.size === state.selectedSize
          const colorMatch = state.selectedColor === 'all' || product.color === state.selectedColor
          matchSizeAndColor = sizeMatch && colorMatch
        }

        return matchCategory && matchBrand && matchGender && matchSizeAndColor
      })
    }
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const data = await productService.getAll()
        // Handle Laravel Resource structure if it exists, otherwise use raw data
        this.products = (data as any).data ?? data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal mengambil data product'
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(id: number) {
      this.loading = true
      this.error = null

      try {
        const data = await productService.getById(id)
        this.product = (data as any).data ?? data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal mengambil detail product'
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
      } catch (error: any) {
        if (error.response?.status === 422) {
          this.validationErrors = error.response.data.errors
        }

        this.error = error.response?.data?.message || 'Gagal menambahkan product'
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
      } catch (error: any) {
        if (error.response?.status === 422) {
          this.validationErrors = error.response.data.errors
        }

        this.error = error.response?.data?.message || 'Gagal mengupdate product'
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
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Gagal menghapus product'
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
