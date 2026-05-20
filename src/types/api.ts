export interface ApiResource<T> {
  success?: boolean
  message?: string
  data: T
}

export type ApiPayload<T> = T | ApiResource<T>

export interface ApiValidationError {
  message?: string
  errors?: Record<string, string[]>
}
