<script setup lang="ts">
import { useRouter } from 'vue-router'
import Navbar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import { XCircle, RefreshCcw, Home } from '@lucide/vue'

const router = useRouter()
</script>

<template>
  <Navbar />
  
  <main class="mx-auto min-h-[70vh] flex items-center justify-center px-6 py-20">
    <div class="max-w-md w-full text-center">
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <div class="absolute inset-0 bg-red-100 rounded-full scale-150 animate-pulse"></div>
          <XCircle class="relative w-24 h-24 text-red-500" />
        </div>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Pembayaran Gagal</h1>
      <p class="text-gray-600 mb-10 leading-relaxed">
        Maaf, terjadi masalah saat memproses pembayaran Anda. Silakan coba lagi atau hubungi layanan pelanggan kami jika masalah berlanjut.
      </p>
      
      <div class="grid gap-4">
        <button 
          @click="router.push('/cart')"
          class="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all"
        >
          Coba Lagi
          <RefreshCcw class="w-5 h-5" />
        </button>
        
        <button 
          @click="router.push('/')"
          class="flex items-center justify-center gap-2 w-full bg-white text-gray-900 border border-gray-200 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          Kembali ke Beranda
          <Home class="w-5 h-5" />
        </button>
      </div>
    </div>
  </main>

  <Footer />
</template>
