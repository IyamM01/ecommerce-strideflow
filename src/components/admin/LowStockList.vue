<script setup lang="ts">
defineProps<{
  items: {
    name: string
    variant: string
    count: number
    image: string
  }[]
}>()
</script>

<template>
  <div
    class="bg-surface-container-lowest rounded-lg shadow-sm border border-surface-container-high p-6 flex flex-col"
  >
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-on-background flex items-center gap-2">
        <span class="material-symbols-outlined text-secondary-container">warning</span>
        Low Stock
      </h2>

      <a class="text-sm text-primary-container hover:underline font-semibold" href="#">
        View All
      </a>
    </div>

    <div class="flex flex-col gap-4 flex-1">
      <div
        v-for="item in items"
        :key="item.name"
        class="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors"
      >
        <div class="w-12 h-12 bg-surface-container-high rounded-lg overflow-hidden shrink-0">
          <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-on-background truncate">
            {{ item.name }}
          </p>
          <p class="text-xs text-on-surface-variant mt-0.5">
            {{ item.variant }}
          </p>
        </div>

        <div class="text-right shrink-0">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="
              item.count <= 5
                ? 'bg-error-container text-on-error-container'
                : 'bg-surface-container-highest text-on-surface'
            "
          >
            {{ item.count }} Left
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
