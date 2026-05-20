<script setup lang="ts">
defineProps<{
  images: string[]
  selectedIndex: number
  badge?: string
  stock?: number
  productName: string
}>()

const emit = defineEmits<{
  (e: 'select', index: number): void
}>()
</script>

<template>
  <div class="col-span-1 lg:col-span-7 flex flex-col gap-3">
    <!-- Main Image -->
    <div
      class="w-full bg-[#F6F6F6] rounded-2xl overflow-hidden relative aspect-[4/5] md:h-[680px] md:aspect-auto shadow-sm"
    >
      <img
        :src="images[selectedIndex]"
        :alt="productName"
        class="w-full h-full object-cover transition-all duration-500"
      />
      <!-- Badges -->
      <div class="absolute top-4 left-4 flex gap-2">
        <span
          v-if="badge"
          class="bg-black text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
        >
          {{ badge }}
        </span>
        <span
          v-if="stock !== undefined && stock < 10"
          class="bg-red-100 text-red-700 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
        >
          Low Stock
        </span>
      </div>
    </div>

    <!-- Thumbnails -->
    <div class="grid grid-cols-4 gap-3">
      <button
        v-for="(img, idx) in images"
        :key="idx"
        @click="emit('select', idx)"
        class="bg-[#F6F6F6] rounded-xl overflow-hidden aspect-square transition-all duration-200"
        :class="
          selectedIndex === idx
            ? 'ring-2 ring-black ring-offset-2'
            : 'ring-1 ring-transparent hover:ring-gray-300 hover:ring-offset-1'
        "
      >
        <img :src="img" :alt="`View ${idx + 1}`" class="w-full h-full object-cover" />
      </button>
    </div>
  </div>
</template>
