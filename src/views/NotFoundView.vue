<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowLeft, Home } from '@lucide/vue'
import Navbar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <Navbar />

  <main
    class="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center"
  >
    <p class="text-sm font-bold uppercase tracking-widest text-gray-400">404</p>
    <h1 class="mt-3 text-4xl font-black text-gray-950">Halaman tidak ditemukan</h1>
    <p class="mt-4 max-w-xl text-gray-600">
      Alamat yang dibuka tidak tersedia atau sudah dipindahkan.
    </p>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-900"
        type="button"
        @click="$router.back()"
      >
        <ArrowLeft class="h-4 w-4" />
        Kembali
      </button>

      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        <Home class="h-4 w-4" />
        Beranda
      </RouterLink>
    </div>
  </main>

  <Footer />
</template>
