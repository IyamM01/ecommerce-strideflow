export interface AdminUserFormValues {
  name: string
  email: string
  phone: string
  role: 'customer' | 'admin'
  password: string
  password_confirmation: string
}
