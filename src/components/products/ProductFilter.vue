<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { categoryService } from '@/services/categoryService'
import { brandService } from '@/services/brandService'
import type { Category } from '@/types/category'
import type { ProductRelation } from '@/types/product'
import { useProductStore } from '@/stores/productStore'
import { unwrapCollection } from '@/utils/apiResponse'

const productStore = useProductStore()
const categories = ref<Category[]>([])
const brands = ref<ProductRelation[]>([])

onMounted(async () => {
  try {
    const [catData, brandData] = await Promise.all([
      categoryService.getAll(),
      brandService.getAll(),
    ])
    categories.value = unwrapCollection<Category>(catData)
    brands.value = unwrapCollection<ProductRelation>(brandData)
  } catch (error) {
    console.error('Failed to fetch filter data:', error)
  }
})

const selectCategory = (categoryId: number | 'all') => {
  productStore.selectedCategory = categoryId
}

const selectBrand = (brandId: number | 'all') => {
  productStore.selectedBrand = brandId
}

const selectSize = (size: string) => {
  productStore.selectedSize = productStore.selectedSize === size ? 'all' : size
}

const selectColor = (color: string) => {
  productStore.selectedColor = productStore.selectedColor === color ? 'all' : color
}

const priceRange = ref(100)

const availableSizes = computed(() => {
  const sizes = new Set<string>()
  productStore.products.forEach((p) => {
    if (p.size) sizes.add(p.size)
  })
  return Array.from(sizes).sort()
})

const availableColors = computed(() => {
  const colors = new Set<string>()
  productStore.products.forEach((p) => {
    if (p.color) colors.add(p.color)
  })
  return Array.from(colors).sort()
})
</script>

<template>
  <aside class="w-full md:w-56 flex-shrink-0 space-y-8 md:sticky md:top-32 md:self-start">
    <!-- Categories -->
    <div>
      <h3 class="text-base font-semibold text-gray-900 mb-4">Categories</h3>
      <div class="space-y-2.5">
        <label class="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name="category"
            :checked="productStore.selectedCategory === 'all'"
            @change="selectCategory('all')"
            class="h-3.5 w-3.5 rounded-full border-gray-300 text-black focus:ring-black cursor-pointer"
          />
          <span class="text-sm text-gray-600 group-hover:text-black transition-colors"
            >All Apparel</span
          >
        </label>
        <label
          v-for="cat in categories"
          :key="cat.id"
          class="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="radio"
            name="category"
            :checked="productStore.selectedCategory === cat.id"
            @change="selectCategory(cat.id)"
            class="h-3.5 w-3.5 rounded-full border-gray-300 text-black focus:ring-black cursor-pointer"
          />
          <span class="text-sm text-gray-600 group-hover:text-black transition-colors">{{
            cat.name
          }}</span>
        </label>
      </div>
    </div>

    <!-- Brands -->
    <div>
      <h3 class="text-base font-semibold text-gray-900 mb-4">Brands</h3>
      <div class="space-y-2.5">
        <label class="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name="brand"
            :checked="productStore.selectedBrand === 'all'"
            @change="selectBrand('all')"
            class="h-3.5 w-3.5 rounded-full border-gray-300 text-black focus:ring-black cursor-pointer"
          />
          <span class="text-sm text-gray-600 group-hover:text-black transition-colors"
            >All Brands</span
          >
        </label>
        <label
          v-for="brand in brands"
          :key="brand.id"
          class="flex items-center gap-3 cursor-pointer group"
        >
          <input
            type="radio"
            name="brand"
            :checked="productStore.selectedBrand === brand.id"
            @change="selectBrand(brand.id)"
            class="h-3.5 w-3.5 rounded-full border-gray-300 text-black focus:ring-black cursor-pointer"
          />
          <span class="text-sm text-gray-600 group-hover:text-black transition-colors">{{
            brand.name
          }}</span>
        </label>
      </div>
    </div>

    <!-- Size -->
    <div v-if="availableSizes.length > 0">
      <h3 class="text-base font-semibold text-gray-900 mb-4">Size</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="size in availableSizes"
          :key="size"
          @click="selectSize(size)"
          class="px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200"
          :class="[
            productStore.selectedSize === size
              ? 'bg-black text-white border-black'
              : 'border-gray-200 text-gray-600 hover:border-black hover:text-black',
          ]"
        >
          {{ size }}
        </button>
      </div>
    </div>

    <!-- Price Range -->
    <div>
      <h3 class="text-base font-semibold text-gray-900 mb-4">Price Range</h3>
      <input
        type="range"
        min="0"
        max="200"
        v-model="priceRange"
        class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
      />
      <div class="flex justify-between mt-2 text-xs font-medium text-gray-500">
        <span>$0</span>
        <span>$200+</span>
      </div>
    </div>

    <!-- Colors -->
    <div v-if="availableColors.length > 0">
      <h3 class="text-base font-semibold text-gray-900 mb-4">Colors</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="color in availableColors"
          :key="color"
          @click="selectColor(color)"
          class="px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200"
          :class="[
            productStore.selectedColor === color
              ? 'bg-black text-white border-black'
              : 'border-gray-200 text-gray-600 hover:border-black hover:text-black',
          ]"
        >
          {{ color }}
        </button>
      </div>
    </div>
  </aside>
</template>
