<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="rounded-2xl bg-gray-50 py-24 text-center">
    <h2 class="text-xl font-bold text-black">Your cart is empty</h2>

    <p class="mt-2 text-sm text-gray-500">
      Looks like you haven't added any products yet.
    </p>

    <RouterLink
      to="/men"
      class="mt-6 inline-flex rounded-full bg-black px-8 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-gray-800"
    >
      Start Shopping
    </RouterLink>
  </div>
</template>
