import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { checkoutService } from '@/services/checkoutService'
import type {
  CheckoutPayload,
  PaymentResultQuery,
  XenditCheckoutResponse,
  XenditInvoice,
} from '@/types/payment'
import { getApiErrorMessage, unwrapResource } from '@/utils/apiResponse'

const getRedirectUrl = (response: XenditCheckoutResponse): string | null => {
  const invoice = unwrapResource<XenditInvoice>(response.data ?? response, {})
  return (
    invoice.payment_url ??
    invoice.invoice_url ??
    response.payment_url ??
    response.invoice_url ??
    null
  )
}

const normalizePaymentResult = (response: XenditCheckoutResponse): XenditInvoice => {
  return {
    ...response,
    ...unwrapResource<XenditInvoice>(response.data ?? response, {}),
  }
}

export const useCheckoutStore = defineStore('checkout', () => {
  const isProcessing = ref(false)
  const error = ref<string | null>(null)
  const currentPayment = ref<XenditInvoice | null>(null)
  const lastResult = ref<PaymentResultQuery | null>(null)

  const hasPaymentRedirect = computed(() => {
    return Boolean(currentPayment.value?.payment_url ?? currentPayment.value?.invoice_url)
  })

  async function createInvoice(payload: CheckoutPayload) {
    isProcessing.value = true
    error.value = null

    try {
      const response = await checkoutService.createXenditInvoice(payload)
      const redirectUrl = getRedirectUrl(response)

      if (!redirectUrl) {
        throw new Error('URL pembayaran Xendit tidak ditemukan dari server.')
      }

      currentPayment.value = {
        ...normalizePaymentResult(response),
        payment_url: redirectUrl,
      }

      return {
        payment: currentPayment.value,
        redirectUrl,
      }
    } catch (checkoutError) {
      error.value = getApiErrorMessage(
        checkoutError,
        'Terjadi kesalahan saat membuat invoice Xendit. Silakan coba lagi.',
      )
      throw checkoutError
    } finally {
      isProcessing.value = false
    }
  }

  function setPaymentResult(result: PaymentResultQuery) {
    lastResult.value = result
  }

  function reset() {
    error.value = null
    currentPayment.value = null
  }

  return {
    currentPayment,
    error,
    hasPaymentRedirect,
    isProcessing,
    lastResult,
    createInvoice,
    reset,
    setPaymentResult,
  }
})
