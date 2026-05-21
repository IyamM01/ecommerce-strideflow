import { computed, nextTick, reactive, ref, watch, type Ref } from 'vue'

import { orderService } from '@/services/orderService'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/authStore'
import type { Order } from '@/types/order'
import type { ProfileFormValues } from '@/types/profile'
import type { User } from '@/types/user'
import { getApiErrorMessage } from '@/utils/apiResponse'

const ORDERS_ROUTE = '/profile/orders'
const DEFAULT_DISPLAY_NAME = 'StrideFlow Member'
const DEFAULT_INITIALS = 'SF'
const RECENT_ORDERS_LIMIT = 5

const createEmptyProfileForm = (): ProfileFormValues => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const splitName = (fullName?: string) => {
  const value = fullName?.trim() ?? ''

  if (!value) {
    return { firstName: '', lastName: '' }
  }

  const [firstName = '', ...lastNameParts] = value.split(/\s+/)

  return {
    firstName,
    lastName: lastNameParts.join(' '),
  }
}

const joinName = (form: ProfileFormValues) =>
  [form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(' ').trim()

const getInitials = (name: string) => {
  const normalizedName = name.trim()

  if (!normalizedName) return DEFAULT_INITIALS

  return normalizedName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const formatMemberSince = (createdAt?: string) => {
  if (!createdAt) return '-'

  return new Date(createdAt).toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric',
  })
}

const buildProfilePayload = (form: ProfileFormValues) => ({
  name: joinName(form),
  email: form.email.trim(),
  phone: form.phone.trim() || undefined,
})

/**
 * Orchestrates profile page state: user data, edit form values,
 * feedback messages, recent orders, and orders-section scrolling.
 */
export const useProfilePage = (routePath: Ref<string>, ordersSection: Ref<HTMLElement | null>) => {
  const authStore = useAuthStore()

  const loading = ref(true)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const profile = ref<User | null>(null)
  const orders = ref<Order[]>([])
  const form = reactive<ProfileFormValues>(createEmptyProfileForm())

  const displayName = computed(() => profile.value?.name || DEFAULT_DISPLAY_NAME)
  const initials = computed(() => getInitials(displayName.value))
  const memberSince = computed(() => formatMemberSince(profile.value?.created_at))
  const recentOrders = computed(() => orders.value.slice(0, RECENT_ORDERS_LIMIT))
  const combinedName = computed(() => joinName(form))

  const setFeedback = (message: { error?: string | null; success?: string | null }) => {
    error.value = message.error ?? null
    successMessage.value = message.success ?? null
  }

  const applyProfileToForm = (user: User) => {
    const { firstName, lastName } = splitName(user.name)

    form.firstName = firstName
    form.lastName = lastName
    form.email = user.email
    form.phone = user.phone ?? ''
  }

  const syncProfile = (user: User) => {
    profile.value = user
    authStore.syncUser(user)
    applyProfileToForm(user)
  }

  const scrollToOrdersIfNeeded = async () => {
    if (routePath.value !== ORDERS_ROUTE) return

    await nextTick()
    ordersSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const loadProfilePage = async () => {
    loading.value = true
    setFeedback({})

    try {
      const [userData, ordersResponse] = await Promise.all([
        userService.getProfile(),
        orderService.getAll(),
      ])

      syncProfile(userData)
      orders.value = ordersResponse.data ?? []
    } catch (err) {
      setFeedback({ error: getApiErrorMessage(err, 'Gagal memuat profile user.') })
    } finally {
      loading.value = false
      void scrollToOrdersIfNeeded()
    }
  }

  const handleDiscard = () => {
    if (!profile.value) return

    setFeedback({})
    applyProfileToForm(profile.value)
  }

  const handleSubmit = async () => {
    if (!profile.value) return

    if (!combinedName.value || !form.email.trim()) {
      setFeedback({ error: 'Nama dan email wajib diisi.' })
      return
    }

    saving.value = true
    setFeedback({})

    try {
      const updatedUser = await userService.updateProfile(
        profile.value.id,
        buildProfilePayload(form),
      )

      syncProfile(updatedUser)
      setFeedback({ success: 'Profile berhasil diperbarui.' })
    } catch (err) {
      setFeedback({ error: getApiErrorMessage(err, 'Gagal menyimpan perubahan profile.') })
    } finally {
      saving.value = false
    }
  }

  watch(routePath, () => {
    void scrollToOrdersIfNeeded()
  })

  return {
    displayName,
    error,
    form,
    handleDiscard,
    handleSubmit,
    initials,
    loadProfilePage,
    loading,
    memberSince,
    profile,
    recentOrders,
    saving,
    successMessage,
  }
}
