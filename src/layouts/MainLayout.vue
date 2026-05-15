<script setup lang="ts">
import Navbar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-primary">
    <Navbar />

    <main>
      <slot />
    </main>

    <Footer />
  </div>
</template>
