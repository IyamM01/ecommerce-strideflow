<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { checkoutService } from '@/services/checkoutService'
import Navbar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import { CreditCard, Truck, User, Phone, Mail, MapPin, Loader2 } from '@lucide/vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref(false)
const error = ref<string | null>(null)

const form = ref({
  customer_name: authStore.user?.name || '',
  customer_email: authStore.user?.email || '',
  customer_phone: '',
  shipping_address: '',
})

const isFormValid = computed(() => {
  return (
    form.value.customer_name &&
    form.value.customer_email &&
    form.value.customer_phone &&
    form.value.shipping_address &&
    cartStore.items.length > 0
  )
})

const handleCheckout = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  error.value = null

  try {
    const payload = {
      ...form.value,
      items: cartStore.items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
    }

    const response = await checkoutService.processCheckout(payload)

    if (response.payment_url) {
      // Clear cart before redirecting
      cartStore.clearCart()
      window.location.href = response.payment_url
    } else {
      throw new Error('Gagal mendapatkan URL pembayaran')
    }
  } catch (err: any) {
    console.error(err)
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat checkout. Silakan coba lagi.'
  } finally {
    isLoading.value = false
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
  <Navbar />

  <main class="mx-auto min-h-screen w-full max-w-[1400px] px-6 py-12 lg:px-12">
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-black">Checkout</h1>
      <p class="mt-1 text-sm text-gray-500">Selesaikan pesanan Anda</p>
    </div>

    <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center py-20">
       <p class="text-lg text-gray-500">Keranjang Anda kosong</p>
       <RouterLink to="/" class="mt-4 text-blue-600 hover:underline">Kembali Belanja</RouterLink>
    </div>

    <div v-else class="grid gap-12 lg:grid-cols-2">
      <!-- Checkout Form -->
      <section class="space-y-8">
        <div class="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <h2 class="flex items-center gap-2 text-xl font-semibold mb-6">
            <User class="w-5 h-5 text-blue-600" />
            Informasi Pelanggan
          </h2>

          <div class="grid gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User class="w-4 h-4" />
                </span>
                <input
                  v-model="form.customer_name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail class="w-4 h-4" />
                  </span>
                  <input
                    v-model="form.customer_email"
                    type="email"
                    placeholder="nama@email.com"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Nomor Telepon</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone class="w-4 h-4" />
                  </span>
                  <input
                    v-model="form.customer_phone"
                    type="tel"
                    placeholder="0812xxxx"
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
          <h2 class="flex items-center gap-2 text-xl font-semibold mb-6">
            <Truck class="w-5 h-5 text-blue-600" />
            Alamat Pengiriman
          </h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Alamat Lengkap</label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-400">
                <MapPin class="w-4 h-4" />
              </span>
              <textarea
                v-model="form.shipping_address"
                rows="4"
                placeholder="Masukkan alamat pengiriman lengkap"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- Order Summary -->
      <section>
        <div class="sticky top-24 rounded-2xl bg-gray-50 p-8 border border-gray-200">
          <h2 class="text-xl font-semibold mb-6">Ringkasan Pesanan</h2>

          <div class="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
            <div
              v-for="item in cartStore.items"
              :key="item.product.id"
              class="flex gap-4"
            >
              <div class="w-20 h-20 bg-white rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                <img
                  :src="item.product.image_url"
                  :alt="item.product.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.product.name }}</h3>
                <div v-if="item.color || item.size" class="flex gap-2 text-[10px] text-gray-400">
                  <span v-if="item.color">Warna: {{ item.color }}</span>
                  <span v-if="item.size">Ukuran: {{ item.size }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5">{{ item.quantity }} x {{ formatCurrency(item.product.price) }}</p>
                <p class="text-sm font-semibold text-gray-900 mt-1">{{ formatCurrency(item.product.price * item.quantity) }}</p>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6 space-y-3">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{{ formatCurrency(cartStore.totalPrice) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span>Biaya Pengiriman</span>
              <span class="text-green-600 font-medium">Gratis</span>
            </div>
            <div class="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
              <span>Total</span>
              <span>{{ formatCurrency(cartStore.totalPrice) }}</span>
            </div>
          </div>

          <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {{ error }}
          </div>

          <button
            @click="handleCheckout"
            :disabled="!isFormValid || isLoading"
            class="w-full mt-8 bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            <span v-else class="flex items-center gap-2">
              Bayar Sekarang
              <CreditCard class="w-5 h-5" />
            </span>
          </button>

          <p class="mt-4 text-center text-xs text-gray-400">
            Pembayaran diproses secara aman oleh Xendit
          </p>
        </div>
      </section>
    </div>
  </main>

  <Footer />
</template>
