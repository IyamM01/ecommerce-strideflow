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

const chartWidth = 100
const chartTop = 8
const chartBottom = 86
const chartHeight = chartBottom - chartTop

const yAxisSteps = computed(() => {
  const steps = []
  const max = maxTotal.value
  for (let i = 5; i >= 0; i--) {
    steps.push(formatCurrencyShort((max / 5) * i))
  }
  return steps
})

const chartPoints = computed(() => {
  if (!props.items.length) return []

  return props.items.map((item, index) => {
    const date = new Date(item.date)
    const day = date.toLocaleDateString('id-ID', { weekday: 'short' })
    const x = props.items.length === 1 ? chartWidth / 2 : (index / (props.items.length - 1)) * chartWidth
    const y = chartBottom - (item.total / maxTotal.value) * chartHeight

    return {
      date: item.date,
      day,
      x,
      y,
      xPosition: `${x}%`,
      yPosition: `${y}%`,
      value: new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(item.total),
      active: item.date === new Date().toISOString().split('T')[0],
    }
  })
})

const linePoints = computed(() => {
  return chartPoints.value.map((point) => `${point.x},${point.y}`).join(' ')
})

const areaPath = computed(() => {
  if (!chartPoints.value.length) return ''

  const firstPoint = chartPoints.value[0]
  const lastPoint = chartPoints.value.at(-1)

  if (!firstPoint || !lastPoint) return ''

  const linePath = chartPoints.value.map((point) => `L ${point.x} ${point.y}`).join(' ')

  return `M ${firstPoint.x} ${chartBottom} L ${firstPoint.x} ${firstPoint.y} ${linePath} L ${lastPoint.x} ${chartBottom} Z`
})
</script>

<template>
  <div
    class="bg-surface-container-lowest rounded-lg shadow-sm border border-surface-container-high p-6"
  >
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-on-background">Revenue Overview</h2>

      <select
        class="bg-surface-container-low border-none text-on-background text-sm rounded-lg py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary-container outline-none"
      >
        <option>Last 7 Days</option>
        <option>Last 30 Days</option>
        <option>This Year</option>
      </select>
    </div>

    <div class="relative h-[300px] w-full pt-4">
      <!-- Y-Axis -->
      <div
        class="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-on-surface-variant w-12 pr-2 text-right"
      >
        <span v-for="step in yAxisSteps" :key="step">{{ step }}</span>
      </div>

      <!-- Chart Content -->
      <div class="absolute bottom-8 left-12 right-0 top-0">
        <svg
          v-if="items.length"
          class="h-full w-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          role="img"
          aria-label="Revenue line chart"
        >
          <defs>
            <linearGradient id="revenue-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="currentColor" stop-opacity="0.18" />
              <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
            </linearGradient>
          </defs>

          <g class="text-outline-variant" stroke="currentColor" stroke-width="0.2">
            <line v-for="index in 5" :key="index" x1="0" x2="100" :y1="index * 17" :y2="index * 17" />
          </g>

          <path
            :d="areaPath"
            class="text-primary-container"
            fill="url(#revenue-area)"
            stroke="none"
          />

          <polyline
            :points="linePoints"
            class="text-primary-container"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            vector-effect="non-scaling-stroke"
          />
        </svg>

        <template v-if="items.length">
          <div
            v-for="point in chartPoints"
            :key="point.date"
            class="group absolute flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-surface-container-lowest transition-transform duration-200 hover:scale-125"
            :class="
              point.active
                ? 'bg-primary-container shadow-[0_0_15px_rgba(17,24,39,0.2)]'
                : 'bg-on-background'
            "
            :style="{ left: point.xPosition, top: point.yPosition }"
          >
            <span
              class="absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-on-background px-3 py-1.5 text-[10px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
            >
              {{ point.value }}
            </span>
          </div>
        </template>

        <!-- Placeholder for empty state -->
        <div
          v-if="!items.length"
          class="flex h-full items-center justify-center text-sm text-on-surface-variant"
        >
          No data available for this period
        </div>
      </div>

      <!-- X-Axis Labels -->
      <div
        class="absolute bottom-0 left-12 right-0 flex justify-between text-[10px] text-on-surface-variant pt-2 border-t border-outline-variant"
      >
        <span v-for="point in chartPoints" :key="point.date" class="flex-1 text-center">
          {{ point.day }}
        </span>
      </div>
    </div>
  </div>
</template>
