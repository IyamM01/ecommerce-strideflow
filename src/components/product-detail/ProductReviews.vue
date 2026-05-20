<script setup lang="ts">
import { Star, Send } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import type { Review } from '@/services/reviewService'

defineProps<{
  avgRating: number
  reviewCount: number
  ratingStars: string[]
  reviews: Review[]
  reviewsLoading: boolean
  submitLoading: boolean
  submitSuccess: boolean
  submitError: string | null
  isLoggedIn: boolean
  newRating: number
  newComment: string
  hoverRating: number
}>()

const emit = defineEmits<{
  (e: 'update:newRating', val: number): void
  (e: 'update:newComment', val: string): void
  (e: 'update:hoverRating', val: number): void
  (e: 'submit'): void
}>()

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
</script>

<template>
  <section class="py-12 border-t border-gray-100">
    <div class="flex flex-col lg:flex-row gap-12">
      <!-- Left: Summary + Form -->
      <div class="lg:w-80 flex-shrink-0">
        <!-- Rating Summary -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-black mb-5">Customer Reviews</h2>
          <div class="flex items-end gap-4 mb-3">
            <span class="text-5xl font-black text-black leading-none">
              {{ avgRating > 0 ? avgRating.toFixed(1) : '-' }}
            </span>
            <div class="flex flex-col gap-1 pb-1">
              <div class="flex gap-0.5">
                <template v-for="(star, i) in ratingStars" :key="i">
                  <Star
                    :size="18"
                    :fill="star !== 'empty' ? 'currentColor' : 'none'"
                    :class="star === 'empty' ? 'text-gray-300' : 'text-black'"
                  />
                </template>
              </div>
              <span class="text-xs text-gray-400 font-medium">
                {{ reviewCount }} {{ reviewCount === 1 ? 'review' : 'reviews' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Write a Review -->
        <div v-if="isLoggedIn">
          <h3 class="text-sm font-bold text-black mb-4 uppercase tracking-widest">
            Write a Review
          </h3>

          <div
            v-if="submitSuccess"
            class="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 font-medium"
          >
            Review submitted successfully!
          </div>

          <form v-else @submit.prevent="emit('submit')" class="flex flex-col gap-4">
            <!-- Star picker -->
            <div>
              <label class="text-xs font-semibold text-gray-500 block mb-2">Your Rating</label>
              <div class="flex gap-1">
                <button
                  v-for="n in 5"
                  :key="n"
                  type="button"
                  @mouseenter="emit('update:hoverRating', n)"
                  @mouseleave="emit('update:hoverRating', 0)"
                  @click="emit('update:newRating', n)"
                  class="transition-transform hover:scale-110"
                >
                  <Star
                    :size="26"
                    :fill="n <= (hoverRating || newRating) ? 'currentColor' : 'none'"
                    :class="n <= (hoverRating || newRating) ? 'text-amber-400' : 'text-gray-300'"
                  />
                </button>
              </div>
            </div>

            <!-- Comment -->
            <div>
              <label class="text-xs font-semibold text-gray-500 block mb-2"
                >Comment (optional)</label
              >
              <textarea
                :value="newComment"
                @input="emit('update:newComment', ($event.target as HTMLTextAreaElement).value)"
                rows="4"
                placeholder="Share your thoughts about this product..."
                class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-black placeholder:text-gray-300 focus:border-black focus:ring-0 focus:outline-none transition-colors resize-none"
              />
            </div>

            <p v-if="submitError" class="text-xs text-red-500 font-medium">{{ submitError }}</p>

            <button
              type="submit"
              :disabled="newRating === 0 || submitLoading"
              class="flex items-center justify-center gap-2 w-full h-11 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send :size="14" />
              {{ submitLoading ? 'Submitting...' : 'Submit Review' }}
            </button>
          </form>
        </div>

        <div v-else class="bg-gray-50 rounded-xl p-5 text-center">
          <p class="text-sm text-gray-500 mb-3">Sign in to write a review</p>
          <RouterLink
            to="/auth/login"
            class="text-xs font-bold uppercase tracking-widest text-black underline underline-offset-4 hover:text-gray-600 transition-colors"
          >
            Sign In
          </RouterLink>
        </div>
      </div>

      <!-- Right: Review List -->
      <div class="flex-1">
        <div v-if="reviewsLoading" class="flex justify-center py-12">
          <div
            class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"
          ></div>
        </div>

        <div
          v-else-if="reviews.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center text-gray-400"
        >
          <Star :size="40" class="mb-4 text-gray-200" />
          <p class="text-sm font-medium">No reviews yet</p>
          <p class="text-xs mt-1">Be the first to share your experience!</p>
        </div>

        <div v-else class="flex flex-col divide-y divide-gray-100">
          <div v-for="review in reviews" :key="review.id" class="py-5 first:pt-0">
            <!-- Header -->
            <div class="flex items-start justify-between mb-2">
              <div>
                <p class="text-sm font-bold text-black">{{ review.user.name }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(review.created_at) }}</p>
              </div>
              <div class="flex gap-0.5">
                <Star
                  v-for="n in 5"
                  :key="n"
                  :size="14"
                  :fill="n <= review.rating ? 'currentColor' : 'none'"
                  :class="n <= review.rating ? 'text-amber-400' : 'text-gray-200'"
                />
              </div>
            </div>
            <!-- Comment -->
            <p v-if="review.comment" class="text-sm text-gray-600 leading-relaxed">
              {{ review.comment }}
            </p>
            <p v-else class="text-xs text-gray-400 italic">No comment provided.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
