<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'
</script>

<template>
  <section class="relative h-[600px] overflow-hidden bg-primary lg:h-[800px]">
    <!-- Hero Image -->
    <img
      src="/src/assets/hero-image.png"
      alt="StrideFlow Launch"
      class="absolute inset-0 h-[600px] w-full object-cover lg:h-[800px]"
    />

    <!-- Overlay -->
    <div class="absolute inset-0 bg-primary/40"></div>

    <!-- Content -->
    <div
      class="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 lg:px-8"
    >
      <div class="w-full max-w-3xl">
        <!-- Headline -->
        <h1
          class="mb-6 font-display font-poppins text-2xl font-black leading-tight tracking-tight text-white lg:text-7xl"
        >
          The Future of Urban Utility
        </h1>

        <!-- Description -->
        <p class="mb-8 max-w-xl font-poppins text-lg leading-relaxed text-white/90 lg:text-xl">
          Engineered for movement. Designed for the city. StrideFlow is arriving soon to redefine
          your everyday journey.
        </p>

        <!-- CTA Button -->
        <router-link
          to="/men"
          class="group inline-flex items-center rounded-lg bg-black px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-secondary"
        >
          Explore Collection
          <ArrowRight
            class="ml-2 h-5 w-5 text-white transition duration-300 group-hover:translate-x-2"
          />
        </router-link>
      </div>
    </div>
  </section>
</template>
