import { onMounted, ref } from 'vue'

import { brandService } from '@/services/brandService'
import { categoryService } from '@/services/categoryService'
import { genderService } from '@/services/genderService'
import { productService } from '@/services/productService'
import type { ProductRelation } from '@/types/product'
import type { SelectOption } from '@/types/productForm'
import { unwrapCollection } from '@/utils/apiResponse'

const uniqueById = (items: Array<ProductRelation | undefined>) =>
  items
    .filter((item): item is ProductRelation => Boolean(item?.id && item?.name))
    .filter((item, index, array) => array.findIndex((entry) => entry.id === item.id) === index)
    .sort((left, right) => left.name.localeCompare(right.name))

const buildFallbackOptions = async () => {
  const products = unwrapCollection<{
    category?: ProductRelation
    brand?: ProductRelation
    gender?: ProductRelation
  }>(await productService.getAll())

  return {
    categories: uniqueById(products.map((product) => product.category)),
    brands: uniqueById(products.map((product) => product.brand)),
    genders: uniqueById(products.map((product) => product.gender)),
  }
}

export const useProductOptions = () => {
  const categoryOptions = ref<SelectOption[]>([])
  const brandOptions = ref<SelectOption[]>([])
  const genderOptions = ref<SelectOption[]>([])
  const optionLoadError = ref<string | null>(null)

  const loadOptions = async () => {
    optionLoadError.value = null

    const [categoriesResult, brandsResult, gendersResult] = await Promise.allSettled([
      categoryService.getAll(),
      brandService.getAll(),
      genderService.getAll(),
    ])

    let fallbackOptions: {
      categories: SelectOption[]
      brands: SelectOption[]
      genders: SelectOption[]
    } | null = null

    const needsFallback = [categoriesResult, brandsResult, gendersResult].some(
      (result) => result.status === 'rejected',
    )

    if (needsFallback) {
      try {
        fallbackOptions = await buildFallbackOptions()
      } catch {
        optionLoadError.value = 'Referensi category, brand, atau gender belum berhasil dimuat.'
      }
    }

    categoryOptions.value =
      categoriesResult.status === 'fulfilled'
        ? unwrapCollection<SelectOption>(categoriesResult.value)
        : (fallbackOptions?.categories ?? [])
    brandOptions.value =
      brandsResult.status === 'fulfilled'
        ? unwrapCollection<SelectOption>(brandsResult.value)
        : (fallbackOptions?.brands ?? [])
    genderOptions.value =
      gendersResult.status === 'fulfilled'
        ? unwrapCollection<SelectOption>(gendersResult.value)
        : (fallbackOptions?.genders ?? [])
  }

  onMounted(() => {
    loadOptions()
  })

  return {
    brandOptions,
    categoryOptions,
    genderOptions,
    loadOptions,
    optionLoadError,
  }
}
