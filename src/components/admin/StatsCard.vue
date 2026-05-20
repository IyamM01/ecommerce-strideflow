<script setup lang="ts">
defineProps<{
  title: string
  value: string
  icon: string
}>()
</script>

<template>
  <div
    class="rounded-3xl border border-surface-container-high bg-surface-container-lowest p-6 shadow-sm"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          {{ title }}
        </p>
        <p class="mt-6 text-4xl font-black tracking-tight text-on-background">
          {{ value }}
        </p>
      </div>

      <div class="rounded-2xl bg-surface-container-low p-3 text-primary-container">
        <span class="material-symbols-outlined text-[28px]">{{ icon }}</span>
      </div>
    </div>
  </div>
</template>
