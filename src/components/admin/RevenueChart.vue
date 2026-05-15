<script setup lang="ts">
import { computed } from 'vue'
import type { RevenueChartItem } from '@/types/dashboard'

const props = defineProps<{
  items: RevenueChartItem[]
}>()

const formatCurrencyShort = (value: number) => {
  if (value >= 1000000) {
    return `Rp${(value / 1000000).toFixed(1)}jt`
  }
  if (value >= 1000) {
    return `Rp${(value / 1000).toFixed(0)}rb`
  }
  return `Rp${value}`
}

const maxTotal = computed(() => {
  const values = props.items.map((item) => item.total)
  return Math.max(...values, 1000) // Default to 1000 if empty
})

const yAxisSteps = computed(() => {
  const steps = []
  const max = maxTotal.value
  for (let i = 5; i >= 0; i--) {
    steps.push(formatCurrencyShort((max / 5) * i))
  }
  return steps
})

const bars = computed(() => {
  if (!props.items.length) return []

  return props.items.map((item) => {
    const date = new Date(item.date)
    const day = date.toLocaleDateString('id-ID', { weekday: 'short' })
    const height = `${(item.total / maxTotal.value) * 100}%`

    return {
      day,
      value: new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(item.total),
      height,
      active: item.date === new Date().toISOString().split('T')[0],
    }
  })
})
</script>

<template>
  <div class="bg-surface-container-lowest rounded-lg shadow-sm border border-surface-container-high p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-on-background">Revenue Overview</h2>

      <select class="bg-surface-container-low border-none text-on-background text-sm rounded-lg py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary-container outline-none">
        <option>Last 7 Days</option>
        <option>Last 30 Days</option>
        <option>This Year</option>
      </select>
    </div>

    <div class="h-[300px] w-full flex items-end justify-between gap-2 pt-4 relative">
      <!-- Y-Axis -->
      <div class="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-on-surface-variant w-12 pr-2 text-right">
        <span v-for="step in yAxisSteps" :key="step">{{ step }}</span>
      </div>

      <!-- Chart Content -->
      <div class="w-full pl-12 flex items-end justify-between h-[270px]">
        <div
          v-for="bar in bars"
          :key="bar.day"
          class="flex-1 max-w-[40px] mx-1 rounded-t-sm group relative transition-all duration-500 ease-out"
          :class="bar.active ? 'bg-primary-container shadow-[0_0_15px_rgba(17,24,39,0.2)]' : 'bg-surface-container-high hover:bg-primary-container'"
          :style="{ height: bar.height }"
        >
          <!-- Tooltip -->
          <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-background text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
            {{ bar.value }}
          </div>
        </div>

        <!-- Placeholder for empty state -->
        <div v-if="!items.length" class="flex-1 flex items-center justify-center text-on-surface-variant text-sm h-full">
          No data available for this period
        </div>
      </div>

      <!-- X-Axis Labels -->
      <div class="absolute bottom-0 left-12 right-0 flex justify-between text-[10px] text-on-surface-variant pt-2 border-t border-outline-variant">
        <span
          v-for="bar in bars"
          :key="bar.day"
          class="flex-1 text-center"
        >
          {{ bar.day }}
        </span>
      </div>
    </div>
  </div>
</template>
