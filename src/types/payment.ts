export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'SETTLED'
  | 'EXPIRED'
  | 'FAILED'
  | 'CANCELED'
  | 'UNKNOWN'
  | (string & {})

export interface CheckoutItemPayload {
  product_id: number
  quantity: number
  price: number
}

export interface CheckoutPayload {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  items: CheckoutItemPayload[]
}

export interface XenditInvoice {
  external_id?: string
  invoice_id?: string
  payment_url?: string
  invoice_url?: string
  amount?: number
  status?: PaymentStatus
  order_id?: number
  order_code?: string
}

export interface XenditCheckoutResponse extends XenditInvoice {
  success?: boolean
  message?: string
  data?: XenditInvoice
}

export interface PaymentResultQuery {
  externalId?: string
  invoiceId?: string
  status: PaymentStatus
  paymentMethod?: string
  paidAt?: string
}
