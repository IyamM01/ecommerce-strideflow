<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import Sidebar from '@/components/admin/Sidebar.vue'
import { brandService } from '@/services/brandService'
import type { ProductRelation } from '@/types/product'
import { getApiErrorMessage, unwrapCollection } from '@/utils/apiResponse'

const brands = ref<ProductRelation[]>([])
const loading = ref(true)
const saving = ref(false)
const updatingId = ref<number | null>(null)
const deletingId = ref<number | null>(null)
const editing = ref<{ id: number; name: string } | null>(null)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const brandName = ref('')
const searchQuery = ref('')

const filteredBrands = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  if (!keyword) return brands.value

  return brands.value.filter((brand) => brand.name.toLowerCase().includes(keyword))
})

const setFeedback = (message: { error?: string | null; success?: string | null }) => {
  error.value = message.error ?? null
  successMessage.value = message.success ?? null
}

const loadBrands = async () => {
  loading.value = true
  setFeedback({})

  try {
    brands.value = unwrapCollection<ProductRelation>(await brandService.getAll())
  } catch (err) {
    setFeedback({ error: getApiErrorMessage(err, 'Gagal memuat brand.') })
  } finally {
    loading.value = false
  }
}

const createBrand = async () => {
  const name = brandName.value.trim()

  if (!name) {
    setFeedback({ error: 'Nama brand wajib diisi.' })
    return
  }

  saving.value = true
  setFeedback({})

  try {
    await brandService.create({ name })
    brandName.value = ''
    setFeedback({ success: 'Brand berhasil ditambahkan.' })
    await loadBrands()
  } catch (err) {
    setFeedback({ error: getApiErrorMessage(err, 'Gagal menambahkan brand.') })
  } finally {
    saving.value = false
  }
}

const startEdit = (brand: ProductRelation) => {
  editing.value = {
    id: brand.id,
    name: brand.name,
  }
  setFeedback({})
}

const cancelEdit = () => {
  editing.value = null
}

const updateBrand = async () => {
  if (!editing.value) return

  const name = editing.value.name.trim()

  if (!name) {
    setFeedback({ error: 'Nama brand wajib diisi.' })
    return
  }

  updatingId.value = editing.value.id
  setFeedback({})

  try {
    await brandService.update(editing.value.id, { name })
    editing.value = null
    setFeedback({ success: 'Brand berhasil diperbarui.' })
    await loadBrands()
  } catch (err) {
    setFeedback({ error: getApiErrorMessage(err, 'Gagal memperbarui brand.') })
  } finally {
    updatingId.value = null
  }
}

const deleteBrand = async (brand: ProductRelation) => {
  if (!confirm(`Hapus brand "${brand.name}"?`)) return

  deletingId.value = brand.id
  setFeedback({})

  try {
    await brandService.delete(brand.id)

    if (editing.value?.id === brand.id) {
      editing.value = null
    }

    setFeedback({ success: 'Brand berhasil dihapus.' })
    await loadBrands()
  } catch (err) {
    setFeedback({ error: getApiErrorMessage(err, 'Gagal menghapus brand.') })
  } finally {
    deletingId.value = null
  }
}

onMounted(loadBrands)
</script>

<template>
  <div class="flex min-h-screen bg-background font-inter text-on-background">
    <Sidebar />

    <main class="flex-1 p-margin md:ml-64">
      <header class="mb-margin flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-on-background">Brands</h1>
          <p class="text-on-surface-variant">Kelola brand yang tersedia untuk produk toko.</p>
        </div>

        <div
          class="rounded-2xl border border-surface-container-high bg-surface-container-lowest px-5 py-3"
        >
          <p class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Total Brand
          </p>
          <p class="mt-1 text-2xl font-black text-on-background">{{ brands.length }}</p>
        </div>
      </header>

      <div
        v-if="error"
        class="mb-5 rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-sm font-semibold text-error"
      >
        {{ error }}
      </div>

      <div
        v-if="successMessage"
        class="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
      >
        {{ successMessage }}
      </div>

      <section
        class="mb-margin overflow-hidden rounded-3xl border border-surface-container-high bg-surface-container-lowest shadow-sm"
      >
        <div class="border-b border-surface-container-high px-6 py-5">
          <h2 class="text-xl font-bold text-on-background">Tambah Brand</h2>
          <p class="mt-1 text-sm text-on-surface-variant">Contoh: Nike, Adidas, Puma.</p>
        </div>

        <form class="grid gap-3 p-6" @submit.prevent="createBrand">
          <label class="text-sm font-semibold text-on-background" for="brand-name">
            Nama Brand
          </label>
          <div class="flex flex-col gap-3 sm:flex-row">
            <input
              id="brand-name"
              v-model="brandName"
              class="min-w-0 flex-1 rounded-2xl border border-surface-container-high bg-surface px-4 py-3 text-sm outline-none transition focus:border-primary"
              placeholder="Masukkan nama brand"
              type="text"
            />
            <button
              class="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              :disabled="saving"
            >
              {{ saving ? 'Menyimpan...' : 'Tambah Brand' }}
            </button>
          </div>
        </form>
      </section>

      <section
        class="overflow-hidden rounded-3xl border border-surface-container-high bg-surface-container-lowest shadow-sm"
      >
        <div
          class="flex flex-col gap-4 border-b border-surface-container-high px-6 py-5 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h2 class="text-xl font-bold text-on-background">Daftar Brand</h2>
            <p class="mt-1 text-sm text-on-surface-variant">Edit atau hapus brand dari katalog.</p>
          </div>

          <div class="relative w-full md:max-w-sm">
            <span
              class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
            >
              search
            </span>
            <input
              v-model="searchQuery"
              class="w-full rounded-xl border-none bg-surface-container-low py-3 pl-12 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-primary"
              placeholder="Search brand..."
              type="text"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr
                class="border-b border-surface-container-high bg-surface-container-low/60 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant"
              >
                <th class="px-6 py-4">Nama Brand</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-surface-container-high">
              <tr v-if="loading">
                <td colspan="2" class="px-6 py-10 text-center text-sm text-on-surface-variant">
                  Memuat brand...
                </td>
              </tr>

              <tr
                v-for="brand in filteredBrands"
                v-else
                :key="brand.id"
                class="hover:bg-surface-container-low"
              >
                <td class="px-6 py-4">
                  <input
                    v-if="editing?.id === brand.id"
                    v-model="editing.name"
                    class="w-full rounded-xl border border-surface-container-high bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary"
                    type="text"
                  />
                  <span v-else class="text-sm font-bold text-on-background">
                    {{ brand.name }}
                  </span>
                </td>

                <td class="px-6 py-4">
                  <div class="flex justify-end gap-2">
                    <template v-if="editing?.id === brand.id">
                      <button
                        class="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                        type="button"
                        :disabled="updatingId === brand.id"
                        @click="updateBrand"
                      >
                        {{ updatingId === brand.id ? 'Saving...' : 'Save' }}
                      </button>
                      <button
                        class="rounded-lg border border-surface-container-high px-3 py-2 text-xs font-bold text-on-background transition hover:bg-surface-container-low"
                        type="button"
                        @click="cancelEdit"
                      >
                        Cancel
                      </button>
                    </template>

                    <template v-else>
                      <button
                        class="rounded-lg bg-surface-container-high px-3 py-2 text-xs font-bold text-on-surface transition hover:bg-primary-container hover:text-white"
                        type="button"
                        @click="startEdit(brand)"
                      >
                        Edit
                      </button>
                      <button
                        class="rounded-lg bg-error-container px-3 py-2 text-xs font-bold text-error transition hover:bg-error hover:text-white disabled:opacity-60"
                        type="button"
                        :disabled="deletingId === brand.id"
                        @click="deleteBrand(brand)"
                      >
                        {{ deletingId === brand.id ? 'Deleting...' : 'Delete' }}
                      </button>
                    </template>
                  </div>
                </td>
              </tr>

              <tr v-if="!loading && filteredBrands.length === 0">
                <td colspan="2" class="px-6 py-10 text-center text-sm text-on-surface-variant">
                  Brand tidak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>
