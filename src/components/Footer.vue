<script setup lang="ts">
defineOptions({
  name: 'AppFooter',
})
</script>

<template>
  <footer class="w-full border-t border-slate-200 bg-white pb-8 pt-16">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div
        class="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.7fr))]"
      >
        <div class="flex max-w-xl flex-col gap-6 lg:pr-10">
          <h2 class="text-2xl font-black uppercase tracking-tight text-primary">STRIDEFLOW</h2>
          <p class="max-w-md text-[15px] leading-8 text-slate-700">
            Join our newsletter for early access to drops, exclusive collaborations, and urban
            utility insights.
          </p>

          <form
            class="mt-2 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center"
            @submit.prevent
          >
            <input
              type="email"
              placeholder="Email Address"
              class="min-h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:outline-none"
              required
            />
            <button
              type="submit"
              class="min-h-12 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-opacity-90 sm:px-7"
            >
              Subscribe
            </button>
          </form>

          <div class="mt-2 flex items-center gap-4">
            <a
              href="https://www.instagram.com/_terse_rah_/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-secondary transition hover:bg-slate-100 hover:text-primary"
            >
              <img src="/src/assets/instagram.png" alt="instagram" class="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/_terse_rah_/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-secondary transition hover:bg-slate-100 hover:text-primary"
            >
              <img src="/src/assets/instagram.png" alt="instagram" class="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/_terse_rah_/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-secondary transition hover:bg-slate-100 hover:text-primary"
            >
              <img src="/src/assets/instagram.png" alt="instagram" class="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 class="mb-5 text-sm font-semibold uppercase tracking-wide text-secondary">SHOP</h3>
          <ul class="space-y-4">
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >New Arrivals</a
              >
            </li>
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >Outerwear</a
              >
            </li>
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >Hoodies</a
              >
            </li>
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >Footwear</a
              >
            </li>
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >Accessories</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-5 text-sm font-semibold uppercase tracking-wide text-secondary">SUPPORT</h3>
          <ul class="space-y-4">
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >Help Center</a
              >
            </li>
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >Shipping & Returns</a
              >
            </li>
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >Order Tracking</a
              >
            </li>
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >Contact Us</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-5 text-sm font-semibold uppercase tracking-wide text-secondary">COMPANY</h3>
          <ul class="space-y-4">
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >About Us</a
              >
            </li>
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >Sustainability</a
              >
            </li>
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >Careers</a
              >
            </li>
            <li>
              <a href="#" class="text-[15px] text-slate-700 transition hover:text-primary"
                >Stores</a
              >
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-8">
        <p class="text-sm text-slate-600">&copy; 2026 StrideFlow. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
