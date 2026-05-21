<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import { useCheckoutStore } from '@/stores/checkoutStore'
import { parsePaymentResultQuery } from '@/utils/paymentResult'
import { CheckCircle2, ShoppingBag, ArrowRight } from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const checkoutStore = useCheckoutStore()

const paymentResult = computed(() => parsePaymentResultQuery(route.query, 'PAID'))
const paymentDetails = computed(() =>
  [
    { label: 'Status', value: paymentResult.value.status },
    { label: 'Invoice ID', value: paymentResult.value.invoiceId },
    { label: 'External ID', value: paymentResult.value.externalId },
    { label: 'Metode', value: paymentResult.value.paymentMethod },
  ].filter((item) => item.value),
)

onMounted(() => {
  checkoutStore.setPaymentResult(paymentResult.value)
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

      <div
        v-if="paymentDetails.length > 0"
        class="mb-8 rounded-lg border border-green-100 bg-green-50 p-4 text-left"
      >
        <div
          v-for="detail in paymentDetails"
          :key="detail.label"
          class="flex items-center justify-between gap-4 py-1 text-sm"
        >
          <span class="text-gray-500">{{ detail.label }}</span>
          <span class="font-semibold text-gray-900">{{ detail.value }}</span>
        </div>
      </div>

      <div class="grid gap-4">
        <button
          @click="router.push('/profile/orders')"
          class="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all"
        >
          Lihat Pesanan Saya
          <ShoppingBag class="w-5 h-5" />
        </button>

        <button
          @click="router.push('/shop')"
          class="flex items-center justify-center gap-2 w-full bg-white text-gray-900 border border-gray-200 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all"
        >
          Lanjut Belanja
          <ArrowRight class="w-5 h-5" />
        </button>
      </div>
    </div>
  </main>

  <Footer />
</template>
