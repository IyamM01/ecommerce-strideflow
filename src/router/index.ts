import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

declare module 'vue-router' {
  interface RouteMeta {
    guestOnly?: boolean
    requiresAdmin?: boolean
    requiresAuth?: boolean
    title?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/auth/AuthView.vue'),
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { guestOnly: true, title: 'Login' },
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/auth/RegisterView.vue'),
        meta: { guestOnly: true, title: 'Register' },
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/admin/DashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin Dashboard' },
  },
  {
    path: '/admin/products',
    name: 'admin-products',
    component: () => import('@/views/admin/products/ProductListView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin Products' },
  },
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('@/views/admin/orders/OrderListView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin Orders' },
  },
  {
    path: '/admin/products/create',
    name: 'admin-products-create',
    component: () => import('@/views/admin/products/ProductCreateView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Create Product' },
  },
  {
    path: '/admin/products/:id/edit',
    name: 'admin-products-edit',
    component: () => import('@/views/admin/products/ProductEditView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Edit Product' },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('@/views/admin/users/UserListView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin Users' },
  },
  {
    path: '/admin/users/create',
    name: 'admin-users-create',
    component: () => import('@/views/admin/users/UserCreateView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Create User' },
  },
  {
    path: '/admin/users/:id/edit',
    name: 'admin-users-edit',
    component: () => import('@/views/admin/users/UserEditView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Edit User' },
  },
  {
    path: '/admin/brands',
    name: 'admin-brands',
    component: () => import('@/views/admin/brands/BrandListView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin Brands' },
  },
  {
    path: '/admin/genders',
    name: 'admin-genders',
    component: () => import('@/views/admin/genders/GenderListView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin Genders' },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/ShopView.vue'),
    meta: { title: 'Shop' },
  },
  {
    path: '/men',
    name: 'men',
    component: () => import('@/views/MenView.vue'),
    meta: { title: 'Men Collection' },
  },
  {
    path: '/woman',
    name: 'woman',
    component: () => import('@/views/WomanView.vue'),
    meta: { title: 'Woman Collection' },
  },
  {
    path: '/kids',
    name: 'kids',
    component: () => import('@/views/KidsView.vue'),
    meta: { title: 'Kids Collection' },
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('@/views/ProductDetailView.vue'),
    meta: { title: 'Product Detail' },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/carts/CartView.vue'),
    meta: { requiresAuth: true, title: 'Cart' },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/carts/CheckoutView.vue'),
    meta: { requiresAuth: true, title: 'Checkout' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/ProfileView.vue'),
    meta: { requiresAuth: true, title: 'Profile' },
  },
  {
    path: '/profile/orders',
    name: 'profile-orders',
    component: () => import('@/views/profile/ProfileView.vue'),
    meta: { requiresAuth: true, title: 'My Orders' },
  },
  {
    path: '/payment/success',
    name: 'payment-success',
    component: () => import('@/views/payments/PaymentSuccessView.vue'),
    meta: { title: 'Payment Success' },
  },
  {
    path: '/payment/failed',
    name: 'payment-failed',
    component: () => import('@/views/payments/PaymentFailedView.vue'),
    meta: { title: 'Payment Failed' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return {
      path: '/auth/login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    return { name: 'home' }
  }

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return { name: authStore.user?.role === 'admin' ? 'admin' : 'home' }
  }

  return true
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'Shop'} | StrideFlow`
})

export default router
