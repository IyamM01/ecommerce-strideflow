import { computed, onScopeDispose, reactive, ref, watch, type Ref } from 'vue'

import type { ProductPayload } from '@/types/product'
import type { ProductFormValues } from '@/types/productForm'

type ProductFormErrors = Record<string, string[]>
type ProductFormField = keyof ProductFormValues

interface UseProductFormOptions {
  errors: Ref<ProductFormErrors | undefined>
  initialValues: Ref<Partial<ProductFormValues> | undefined>
  requireImage: Ref<boolean | undefined>
  onSubmit: (payload: ProductPayload) => void
}

const EMPTY_FORM_VALUES: ProductFormValues = {
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
}

// Field rules are kept as data so validation messages stay easy to scan and update.
const REQUIRED_TEXT_FIELDS: Array<{
  field: ProductFormField
  message: string
}> = [
  { field: 'name', message: 'Nama produk wajib diisi.' },
  { field: 'description', message: 'Deskripsi produk wajib diisi.' },
]

const REQUIRED_NUMBER_FIELDS: Array<{
  field: ProductFormField
  message: string
}> = [
  { field: 'price', message: 'Harga wajib diisi.' },
  { field: 'stock', message: 'Stok wajib diisi.' },
]

const REQUIRED_SELECT_FIELDS: Array<{
  field: ProductFormField
  message: string
}> = [
  { field: 'category_id', message: 'Category wajib dipilih.' },
  { field: 'brand_id', message: 'Brand wajib dipilih.' },
  { field: 'gender_id', message: 'Gender wajib dipilih.' },
]

const createFormValues = (values?: Partial<ProductFormValues>): ProductFormValues => ({
  name: values?.name ?? EMPTY_FORM_VALUES.name,
  description: values?.description ?? EMPTY_FORM_VALUES.description,
  price: values?.price ?? EMPTY_FORM_VALUES.price,
  stock: values?.stock ?? EMPTY_FORM_VALUES.stock,
  category_id: values?.category_id ?? EMPTY_FORM_VALUES.category_id,
  brand_id: values?.brand_id ?? EMPTY_FORM_VALUES.brand_id,
  gender_id: values?.gender_id ?? EMPTY_FORM_VALUES.gender_id,
  sku: values?.sku ?? EMPTY_FORM_VALUES.sku,
  size: values?.size ?? EMPTY_FORM_VALUES.size,
  color: values?.color ?? EMPTY_FORM_VALUES.color,
  badge: values?.badge ?? EMPTY_FORM_VALUES.badge,
  image_url: values?.image_url ?? EMPTY_FORM_VALUES.image_url,
})

const normalizeOptionalText = (value: string) => {
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

const isEmptyNumber = (value: unknown) =>
  value === null || value === '' || (typeof value === 'number' && Number.isNaN(value))

const buildValidationErrors = (
  form: ProductFormValues,
  imageFile: File | null,
  requireImage?: boolean,
): ProductFormErrors => {
  const errors: ProductFormErrors = {}

  REQUIRED_TEXT_FIELDS.forEach(({ field, message }) => {
    const value = form[field]

    if (typeof value === 'string' && !value.trim()) {
      errors[field] = [message]
    }
  })

  REQUIRED_NUMBER_FIELDS.forEach(({ field, message }) => {
    if (isEmptyNumber(form[field])) {
      errors[field] = [message]
    }
  })

  REQUIRED_SELECT_FIELDS.forEach(({ field, message }) => {
    if (!form[field]) {
      errors[field] = [message]
    }
  })

  if (requireImage && !imageFile) {
    errors.image = ['Gambar produk wajib dipilih.']
  }

  return errors
}

const buildSubmitPayload = (form: ProductFormValues, imageFile: File | null): ProductPayload => ({
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
  image: imageFile,
})

/**
 * Handles product form state, local validation, image preview lifecycle,
 * and final payload normalization before the parent component submits.
 */
export const useProductForm = (options: UseProductFormOptions) => {
  const form = reactive<ProductFormValues>(createFormValues())
  const imageFile = ref<File | null>(null)
  const imagePreview = ref('')
  const localErrors = ref<ProductFormErrors>({})
  const temporaryPreviewUrl = ref<string | null>(null)

  const initialValuesKey = computed(() =>
    JSON.stringify(createFormValues(options.initialValues.value)),
  )
  const allErrors = computed<ProductFormErrors>(() => ({
    ...options.errors.value,
    ...localErrors.value,
  }))

  const revokeTemporaryPreviewUrl = () => {
    if (!temporaryPreviewUrl.value) return

    URL.revokeObjectURL(temporaryPreviewUrl.value)
    temporaryPreviewUrl.value = null
  }

  const resetForm = (values?: Partial<ProductFormValues>) => {
    Object.assign(form, createFormValues(values))
    imageFile.value = null
    imagePreview.value = form.image_url
    localErrors.value = {}
    revokeTemporaryPreviewUrl()
  }

  const getFieldError = (field: string) => allErrors.value[field]?.[0]

  const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0] ?? null

    imageFile.value = file
    revokeTemporaryPreviewUrl()

    if (!file) {
      imagePreview.value = form.image_url
      return
    }

    temporaryPreviewUrl.value = URL.createObjectURL(file)
    imagePreview.value = temporaryPreviewUrl.value
  }

  const handleSubmit = () => {
    localErrors.value = buildValidationErrors(form, imageFile.value, options.requireImage.value)

    if (Object.keys(localErrors.value).length > 0) return

    options.onSubmit(buildSubmitPayload(form, imageFile.value))
  }

  watch(
    initialValuesKey,
    () => {
      resetForm(options.initialValues.value)
    },
    { immediate: true },
  )

  onScopeDispose(revokeTemporaryPreviewUrl)

  return {
    form,
    getFieldError,
    handleImageChange,
    handleSubmit,
    imagePreview,
  }
}
