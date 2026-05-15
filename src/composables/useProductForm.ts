import { computed, reactive, ref, watch, type Ref } from 'vue'

import type { ProductPayload } from '@/types/product'
import type { ProductFormValues } from '@/types/productForm'

interface UseProductFormOptions {
  errors: Ref<Record<string, string[]> | undefined>
  initialValues: Ref<Partial<ProductFormValues> | undefined>
  requireImage: Ref<boolean | undefined>
  onSubmit: (payload: ProductPayload) => void
}

const createEmptyForm = (): ProductFormValues => ({
  name: '',
  description: '',
  price: null,
  stock: null,
  category_id: null,
  brand_id: null,
  gender_id: null,
  sku: '',
  size: '',
  color: '',
  badge: '',
  image_url: '',
})

const normalizeOptionalText = (value: string) => {
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

export const useProductForm = (options: UseProductFormOptions) => {
  const form = reactive<ProductFormValues>(createEmptyForm())
  const imageFile = ref<File | null>(null)
  const imagePreview = ref('')
  const localErrors = ref<Record<string, string[]>>({})

  const initialValuesKey = computed(() =>
    JSON.stringify({
      name: options.initialValues.value?.name ?? '',
      description: options.initialValues.value?.description ?? '',
      price: options.initialValues.value?.price ?? null,
      stock: options.initialValues.value?.stock ?? null,
      category_id: options.initialValues.value?.category_id ?? null,
      brand_id: options.initialValues.value?.brand_id ?? null,
      gender_id: options.initialValues.value?.gender_id ?? null,
      sku: options.initialValues.value?.sku ?? '',
      size: options.initialValues.value?.size ?? '',
      color: options.initialValues.value?.color ?? '',
      badge: options.initialValues.value?.badge ?? '',
      image_url: options.initialValues.value?.image_url ?? '',
    }),
  )

  const allErrors = computed(() => ({
    ...(options.errors.value ?? {}),
    ...localErrors.value,
  }))

  const assignFormValues = (values?: Partial<ProductFormValues>) => {
    form.name = values?.name ?? ''
    form.description = values?.description ?? ''
    form.price = values?.price ?? null
    form.stock = values?.stock ?? null
    form.category_id = values?.category_id ?? null
    form.brand_id = values?.brand_id ?? null
    form.gender_id = values?.gender_id ?? null
    form.sku = values?.sku ?? ''
    form.size = values?.size ?? ''
    form.color = values?.color ?? ''
    form.badge = values?.badge ?? ''
    form.image_url = values?.image_url ?? ''
    imagePreview.value = form.image_url
    imageFile.value = null
  }

  const getFieldError = (field: string) => allErrors.value[field]?.[0]

  const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0] ?? null
    imageFile.value = file

    if (!file) {
      imagePreview.value = form.image_url
      return
    }

    imagePreview.value = URL.createObjectURL(file)
  }

  const handleSubmit = () => {
    localErrors.value = {}

    if (!form.name.trim()) localErrors.value.name = ['Nama produk wajib diisi.']
    if (!form.description.trim()) localErrors.value.description = ['Deskripsi produk wajib diisi.']
    if (form.price === null || Number.isNaN(form.price)) localErrors.value.price = ['Harga wajib diisi.']
    if (form.stock === null || Number.isNaN(form.stock)) localErrors.value.stock = ['Stok wajib diisi.']
    if (!form.category_id) localErrors.value.category_id = ['Category wajib dipilih.']
    if (!form.brand_id) localErrors.value.brand_id = ['Brand wajib dipilih.']
    if (!form.gender_id) localErrors.value.gender_id = ['Gender wajib dipilih.']
    if (options.requireImage.value && !imageFile.value) {
      localErrors.value.image = ['Gambar produk wajib dipilih.']
    }

    if (Object.keys(localErrors.value).length > 0) return

    options.onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category_id: Number(form.category_id),
      brand_id: Number(form.brand_id),
      gender_id: Number(form.gender_id),
      sku: normalizeOptionalText(form.sku),
      size: normalizeOptionalText(form.size),
      color: normalizeOptionalText(form.color),
      badge: normalizeOptionalText(form.badge),
      image: imageFile.value,
    })
  }

  watch(
    initialValuesKey,
    () => {
      assignFormValues(options.initialValues.value)
    },
    { immediate: true },
  )

  return {
    form,
    getFieldError,
    handleImageChange,
    handleSubmit,
    imagePreview,
  }
}
