<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import { CheckCircle2, ShoppingBag, ArrowRight } from '@lucide/vue'

const router = useRouter()

onMounted(() => {
  // Optional: Verify payment status from API if needed
})
</script>

<template>
  <Navbar />
  
  <main class="mx-auto min-h-[70vh] flex items-center justify-center px-6 py-20">
    <div class="max-w-md w-full text-center">
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <div class="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse"></div>
          <CheckCircle2 class="relative w-24 h-24 text-green-500" />
        </div>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Pembayaran Berhasil!</h1>
      <p class="text-gray-600 mb-10 leading-relaxed">
        Terima kasih atas pesanan Anda. Kami akan segera memproses pengiriman produk pilihan Anda.
      </p>
      
      <div class="grid gap-4">
        <button 
          @click="router.push('/profile/orders')"
          class="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all"
        >
          Lihat Pesanan Saya
          <ShoppingBag class="w-5 h-5" />
        </button>
        
        <button 
          @click="router.push('/')"
          class="flex items-center justify-center gap-2 w-full bg-white text-gray-900 border border-gray-200 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          Lanjut Belanja
          <ArrowRight class="w-5 h-5" />
        </button>
      </div>
    </div>
  </main>

  <Footer />
</template>
