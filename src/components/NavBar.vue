<script setup lang="ts">
import { ref } from 'vue'
import { ShoppingCart, CircleUser, Search } from '@lucide/vue'

const isOpen = ref(false)
</script>

<template>
  <header class="w-full border-b bg-primary">
    <nav class="flex items-center justify-between mx-auto h-18 px-6">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/" class="inline-flex items-center">
          <img src="/src/assets/logo.webp" alt="Logo" class="h-15 w-auto object-contain" />
        </a>
      </div>

      <!-- Menu -->
      <ul class="hidden items-center gap-10 md:flex">
        <li>
          <a
            href="#"
            class="text-sm font-lexend font-medium text-white transition hover:text-text-secondary"
          >
            Men</a
          >
        </li>
        <li>
          <a
            href="#"
            class="text-sm font-lexend font-medium text-white transition hover:text-text-secondary"
          >
            Women
          </a>
        </li>
        <li>
          <a
            href="#"
            class="text-sm font-lexend font-medium text-white transition hover:text-text-secondary"
          >
            Kids
          </a>
        </li>
      </ul>

      <!-- Right Section -->
      <div class="flex items-center gap-5">
        <!-- Search -->
        <div class="hidden lg:block">
          <div class="flex h-10 w-57.5 items-center rounded-full bg-slate-100 px-4">
            <Search class="text-slate-600"/>
            <input
              type="text"
              placeholder="Search..."
              class="ml-2 w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        <!-- Cart -->
        <a
          href="#"
          class="flex items-center gap-1 text-[13px] font-semibold uppercase tracking-wide text-white transition hover:text-text-secondary"
        >
          <ShoppingCart />
        </a>

        <!-- Account -->
        <a
          href="#"
          class="flex items-center gap-1 text-[13px] font-semibold uppercase tracking-wide text-white transition hover:text-text-secondary"
        >
          <CircleUser />
        </a>

        <!-- Mobile Menu Button -->
        <button class="md:hidden" type="button" @click="isOpen = !isOpen">
          <svg
            class="h-6 w-6 text-indigo-900"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!isOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div v-if="isOpen" class="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
      <ul class="space-y-4">
        <li><a href="#" class="block text-sm font-medium text-primary">Men</a></li>
        <li><a href="#" class="block text-sm font-medium text-primary">Women</a></li>
        <li><a href="#" class="block text-sm font-medium text-primary">Kids</a></li>
      </ul>

      <div class="mt-4">
        <div class="flex h-10 items-center rounded-full bg-slate-100 px-4">
          <svg
            class="h-4 w-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0a7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            class="ml-2 w-full bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  </header>
</template>


