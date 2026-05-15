export interface DashboardStats {
  total_sales: number
  total_orders: number
  total_products: number
  total_users: number
}

export interface Brand {
  name: string
}

export interface LowStockProduct {
  name: string
  stock: number
  image_url?: string
  brand?: Brand | null
}

export interface RecentOrder {
  order_code: string
  status: string
  total_price: number
  created_at: string
  user?: {
    name: string
  } | null
}

export interface RevenueChartItem {
  date: string
  total: number
}

export interface DashboardResponse {
  stats: DashboardStats
  low_stock: LowStockProduct[]
  recent_orders: RecentOrder[]
  revenue_chart: RevenueChartItem[]
}

export interface StatCardData {
  revenue: string
  orders: string
  products: string
  users: string
}

export interface LowStockItemView {
  name: string
  variant: string
  count: number
  image: string
}

export interface RecentOrderView {
  id: string
  customer: string
  date: string
  status: string
  total: string
}
