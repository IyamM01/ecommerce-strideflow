import type { LocationQuery, LocationQueryValue } from 'vue-router'
import type { PaymentResultQuery, PaymentStatus } from '@/types/payment'

const firstString = (
  value: LocationQueryValue | LocationQueryValue[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value.find((item): item is string => typeof item === 'string')
  }

  return typeof value === 'string' ? value : undefined
}

export const parsePaymentResultQuery = (
  query: LocationQuery,
  fallbackStatus: PaymentStatus,
): PaymentResultQuery => {
  return {
    externalId: firstString(query.external_id) ?? firstString(query.externalId),
    invoiceId: firstString(query.invoice_id) ?? firstString(query.invoiceId),
    paidAt: firstString(query.paid_at) ?? firstString(query.paidAt),
    paymentMethod: firstString(query.payment_method) ?? firstString(query.paymentMethod),
    status:
      (firstString(query.status)?.toUpperCase() as PaymentStatus | undefined) ?? fallbackStatus,
  }
}
