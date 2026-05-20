<script setup lang="ts">
import { toRef } from 'vue'

import { useProductForm } from '@/composables/useProductForm'
import { useProductOptions } from '@/composables/useProductOptions'
import type { ProductPayload } from '@/types/product'
import type { ProductFormProps } from '@/types/productForm'

const props = withDefaults(defineProps<ProductFormProps>(), {
  loading: false,
  errors: () => ({}),
  initialValues: () => ({}),
  requireImage: false,
})

const emit = defineEmits<{
  submit: [payload: ProductPayload]
  cancel: []
}>()

const initialValues = toRef(props, 'initialValues')
const errors = toRef(props, 'errors')
const requireImage = toRef(props, 'requireImage')

const { form, getFieldError, handleImageChange, handleSubmit, imagePreview } = useProductForm({
  initialValues,
  errors,
  requireImage,
  onSubmit: (payload) => emit('submit', payload),
})

const { brandOptions, categoryOptions, genderOptions, optionLoadError } = useProductOptions()
</script>

<template>
  <div
    class="bg-surface-container-lowest rounded-3xl border border-surface-container-high shadow-sm overflow-hidden"
  >
    <div class="border-b border-surface-container-high px-8 py-6">
      <h1 class="text-3xl font-bold text-on-background">{{ title }}</h1>
      <p class="mt-2 text-sm text-on-surface-variant">
        {{ description }}
      </p>
    </div>

    <form class="grid gap-8 p-8" @submit.prevent="handleSubmit">
      <div
        v-if="optionLoadError"
        class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        {{ optionLoadError }}
      </div>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div class="grid gap-6">
          <div class="grid gap-2">
            <label class="text-sm font-semibold text-on-background" for="name">Nama Produk</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
              placeholder="Contoh: StrideFlow Runner Pro"
            />
            <p v-if="getFieldError('name')" class="text-xs font-medium text-error">
              {{ getFieldError('name') }}
            </p>
          </div>

          <div class="grid gap-2">
            <label class="text-sm font-semibold text-on-background" for="description"
              >Deskripsi</label
            >
            <textarea
              id="description"
              v-model="form.description"
              rows="6"
              class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
              placeholder="Tulis detail produk, material, dan keunggulannya."
            />
            <p v-if="getFieldError('description')" class="text-xs font-medium text-error">
              {{ getFieldError('description') }}
            </p>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="grid gap-2">
              <label class="text-sm font-semibold text-on-background" for="price">Harga</label>
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                min="0"
                class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
                placeholder="250000"
              />
              <p v-if="getFieldError('price')" class="text-xs font-medium text-error">
                {{ getFieldError('price') }}
              </p>
            </div>

            <div class="grid gap-2">
              <label class="text-sm font-semibold text-on-background" for="stock">Stok</label>
              <input
                id="stock"
                v-model.number="form.stock"
                type="number"
                min="0"
                class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
                placeholder="30"
              />
              <p v-if="getFieldError('stock')" class="text-xs font-medium text-error">
                {{ getFieldError('stock') }}
              </p>
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-3">
            <div class="grid gap-2">
              <label class="text-sm font-semibold text-on-background" for="category"
                >Category</label
              >
              <select
                id="category"
                v-model.number="form.category_id"
                class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
              >
                <option :value="null">Pilih category</option>
                <option v-for="category in categoryOptions" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <p v-if="getFieldError('category_id')" class="text-xs font-medium text-error">
                {{ getFieldError('category_id') }}
              </p>
            </div>

            <div class="grid gap-2">
              <label class="text-sm font-semibold text-on-background" for="brand">Brand</label>
              <select
                id="brand"
                v-model.number="form.brand_id"
                class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
              >
                <option :value="null">Pilih brand</option>
                <option v-for="brand in brandOptions" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
              <p v-if="getFieldError('brand_id')" class="text-xs font-medium text-error">
                {{ getFieldError('brand_id') }}
              </p>
            </div>

            <div class="grid gap-2">
              <label class="text-sm font-semibold text-on-background" for="gender">Gender</label>
              <select
                id="gender"
                v-model.number="form.gender_id"
                class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
              >
                <option :value="null">Pilih gender</option>
                <option v-for="gender in genderOptions" :key="gender.id" :value="gender.id">
                  {{ gender.name }}
                </option>
              </select>
              <p v-if="getFieldError('gender_id')" class="text-xs font-medium text-error">
                {{ getFieldError('gender_id') }}
              </p>
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="grid gap-2">
              <label class="text-sm font-semibold text-on-background" for="sku">SKU</label>
              <input
                id="sku"
                v-model="form.sku"
                type="text"
                class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
                placeholder="RUN-PRO-001"
              />
              <p v-if="getFieldError('sku')" class="text-xs font-medium text-error">
                {{ getFieldError('sku') }}
              </p>
            </div>

            <div class="grid gap-2">
              <label class="text-sm font-semibold text-on-background" for="badge">Badge</label>
              <input
                id="badge"
                v-model="form.badge"
                type="text"
                class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
                placeholder="Best Seller"
              />
              <p v-if="getFieldError('badge')" class="text-xs font-medium text-error">
                {{ getFieldError('badge') }}
              </p>
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="grid gap-2">
              <label class="text-sm font-semibold text-on-background" for="size">Size</label>
              <input
                id="size"
                v-model="form.size"
                type="text"
                class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
                placeholder="39, 40, 41, 42"
              />
              <p class="text-xs text-on-surface-variant">Pisahkan beberapa size dengan koma.</p>
              <p v-if="getFieldError('size')" class="text-xs font-medium text-error">
                {{ getFieldError('size') }}
              </p>
            </div>

            <div class="grid gap-2">
              <label class="text-sm font-semibold text-on-background" for="color">Warna</label>
              <input
                id="color"
                v-model="form.color"
                type="text"
                class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
                placeholder="Black"
              />
              <p v-if="getFieldError('color')" class="text-xs font-medium text-error">
                {{ getFieldError('color') }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="grid content-start gap-4 rounded-3xl border border-surface-container-high bg-surface-container-low p-5"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-base font-bold text-on-background">Media Produk</h2>
              <p class="text-xs text-on-surface-variant">
                Upload gambar utama untuk kartu produk dan detail.
              </p>
            </div>
          </div>

          <div
            class="overflow-hidden rounded-2xl border border-dashed border-surface-container-highest bg-surface-container-lowest"
          >
            <div class="aspect-[4/5] w-full">
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Preview product"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="flex h-full items-center justify-center px-6 text-center text-sm text-on-surface-variant"
              >
                Preview gambar akan muncul di sini.
              </div>
            </div>
          </div>

          <div class="grid gap-2">
            <label class="text-sm font-semibold text-on-background" for="image">Gambar</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              class="rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-white"
              @change="handleImageChange"
            />
            <p class="text-xs text-on-surface-variant">
              {{
                requireImage
                  ? 'Upload gambar wajib untuk produk baru.'
                  : 'Kosongkan jika tidak ingin mengganti gambar.'
              }}
            </p>
            <p v-if="getFieldError('image')" class="text-xs font-medium text-error">
              {{ getFieldError('image') }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col-reverse gap-3 border-t border-surface-container-high pt-6 sm:flex-row sm:justify-end"
      >
        <button
          type="button"
          class="rounded-2xl border border-surface-container-high px-5 py-3 text-sm font-semibold text-on-background transition hover:bg-surface-container-low"
          @click="emit('cancel')"
        >
          Batal
        </button>
        <button
          type="submit"
          class="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? 'Menyimpan...' : submitLabel }}
        </button>
      </div>
    </form>
  </div>
</template>
