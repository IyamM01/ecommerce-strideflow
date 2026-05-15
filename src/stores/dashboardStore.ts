import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardService } from '@/services/dashboardService'
import type {
  StatCardData,
  LowStockItemView,
  RecentOrderView,
  RevenueChartItem,
} from '@/types/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  const loading = ref(false)

  const stats = ref<StatCardData>({
    revenue: 'Rp0',
    orders: '0',
    products: '0',
    users: '0',
  })

  const lowStockItems = ref<LowStockItemView[]>([])
  const recentOrders = ref<RecentOrderView[]>([])
  const revenueChart = ref<RevenueChartItem[]>([])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const fetchDashboardData = async () => {
    loading.value = true

    try {
      const data = await dashboardService.getDashboard()

      stats.value = {
        revenue: formatCurrency(data.stats.total_sales),
        orders: data.stats.total_orders.toLocaleString('id-ID'),
        products: data.stats.total_products.toLocaleString('id-ID'),
        users: data.stats.total_users.toLocaleString('id-ID'),
      }

      lowStockItems.value = data.low_stock.map((product) => ({
        name: product.name,
        variant: `Stock: ${product.stock} • ${product.brand?.name || 'No Brand'}`,
        count: product.stock,
        image: product.image_url || 'https://placehold.co/100x100?text=No+Image',
      }))

      recentOrders.value = data.recent_orders.map((order) => ({
        id: `#${order.order_code}`,
        customer: order.user?.name || 'Guest',
        date: new Date(order.created_at).toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        status: formatStatus(order.status),
        total: formatCurrency(order.total_price),
      }))

      revenueChart.value = data.revenue_chart.map((item) => ({
        date: item.date,
        total: Number(item.total),
      }))
    } catch (error) {
      console.error('Failed to fetch dashboard data', error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    stats,
    lowStockItems,
    recentOrders,
    revenueChart,
    fetchDashboardData,
  }
})
