<script setup lang="ts">
defineProps<{
  displayName: string
  email?: string
  initials: string
  memberSince: string
}>()
</script>

<template>
  <section class="relative overflow-hidden rounded-3xl border border-surface-container-high bg-surface-container-lowest p-6 text-center shadow-sm">
    <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-surface-container-high to-surface-container-lowest"></div>

    <div class="relative mt-8">
      <div class="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-surface-container-lowest bg-primary text-2xl font-black text-white shadow-sm">
        {{ initials }}
      </div>
    </div>

    <h2 class="mt-5 text-2xl font-bold text-on-background">{{ displayName }}</h2>
    <p class="mt-1 text-sm text-on-surface-variant">{{ email }}</p>

    <div class="mt-6 grid grid-cols-2 gap-4 border-t border-outline-variant pt-4 text-left">
      <div>
        <span class="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Member Since</span>
        <span class="mt-1 block text-sm font-semibold text-on-background">{{ memberSince }}</span>
      </div>
      <div class="text-right">
        <span class="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Status</span>
        <span class="mt-1 inline-flex items-center gap-1 rounded-full bg-black/5 px-3 py-1 text-xs font-bold text-on-background">
          <span class="material-symbols-outlined text-[14px]">check_circle</span>
          Active
        </span>
      </div>
    </div>
  </section>
</template>
