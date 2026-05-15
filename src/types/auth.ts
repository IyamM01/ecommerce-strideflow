import type { User } from "./user";

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  user: User
  token: string
  type: string
}
