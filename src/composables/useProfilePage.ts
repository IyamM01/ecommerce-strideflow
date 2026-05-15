import { computed, nextTick, reactive, ref, watch, type Ref } from 'vue'
import { orderService } from '@/services/orderService'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/authStore'
import type { Order } from '@/types/order'
import type { ProfileFormValues } from '@/types/profile'
import type { User } from '@/types/user'

const splitName = (fullName?: string) => {
  const value = fullName?.trim() ?? ''

  if (!value) {
    return { firstName: '', lastName: '' }
  }

  const parts = value.split(/\s+/)
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  }
}

const formatErrorMessage = (error: any, fallback: string) => {
  return error.response?.data?.message || fallback
}

export const useProfilePage = (
  routePath: Ref<string>,
  ordersSection: Ref<HTMLElement | null>,
) => {
  const authStore = useAuthStore()

  const loading = ref(true)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const profile = ref<User | null>(null)
  const orders = ref<Order[]>([])

  const form = reactive<ProfileFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const applyProfileToForm = (user: User) => {
    const { firstName, lastName } = splitName(user.name)
    form.firstName = firstName
    form.lastName = lastName
    form.email = user.email
    form.phone = user.phone ?? ''
  }

  const displayName = computed(() => profile.value?.name || 'StrideFlow Member')

  const initials = computed(() => {
    const name = displayName.value.trim()
    if (!name) return 'SF'

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
  })

  const memberSince = computed(() => {
    if (!profile.value?.created_at) return '-'

    return new Date(profile.value.created_at).toLocaleDateString('id-ID', {
      month: 'short',
      year: 'numeric',
    })
  })

  const recentOrders = computed(() => orders.value.slice(0, 5))

  const combinedName = computed(() =>
    [form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(' ').trim(),
  )

  const scrollToOrdersIfNeeded = async () => {
    if (routePath.value !== '/profile/orders') return

    await nextTick()
    ordersSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const loadProfilePage = async () => {
    loading.value = true
    error.value = null

    try {
      const [userData, ordersResponse] = await Promise.all([
        userService.getProfile(),
        orderService.getAll(),
      ])

      profile.value = userData
      authStore.syncUser(userData)
      applyProfileToForm(userData)
      orders.value = ordersResponse.data ?? []
    } catch (err: any) {
      error.value = formatErrorMessage(err, 'Gagal memuat profile user.')
    } finally {
      loading.value = false
      scrollToOrdersIfNeeded()
    }
  }

  const handleDiscard = () => {
    if (!profile.value) return

    successMessage.value = null
    error.value = null
    applyProfileToForm(profile.value)
  }

  const handleSubmit = async () => {
    if (!profile.value) return

    if (!combinedName.value || !form.email.trim()) {
      error.value = 'Nama dan email wajib diisi.'
      successMessage.value = null
      return
    }

    saving.value = true
    error.value = null
    successMessage.value = null

    try {
      const updatedUser = await userService.updateProfile(profile.value.id, {
        name: combinedName.value,
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
      })

      profile.value = updatedUser
      authStore.syncUser(updatedUser)
      applyProfileToForm(updatedUser)
      successMessage.value = 'Profile berhasil diperbarui.'
    } catch (err: any) {
      error.value = formatErrorMessage(err, 'Gagal menyimpan perubahan profile.')
    } finally {
      saving.value = false
    }
  }

  watch(routePath, () => {
    scrollToOrdersIfNeeded()
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
