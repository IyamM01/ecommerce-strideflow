import { isAxiosError } from 'axios'
import type { ApiPayload, ApiValidationError } from '@/types/api'

export const unwrapResource = <T>(payload: ApiPayload<T> | unknown, fallback: T): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data
  }

  return (payload as T) ?? fallback
}

export const unwrapCollection = <T>(payload: ApiPayload<T[]> | unknown): T[] => {
  const data = unwrapResource<T[] | unknown>(payload, [])
  return Array.isArray(data) ? data : []
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError<ApiValidationError>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback
  }

  if (error instanceof Error) {
    return error.message || fallback
  }

  return fallback
}

export const getValidationErrors = (error: unknown): Record<string, string[]> => {
  if (isAxiosError<ApiValidationError>(error) && error.response?.status === 422) {
    return error.response.data.errors ?? {}
  }

  return {}
}
