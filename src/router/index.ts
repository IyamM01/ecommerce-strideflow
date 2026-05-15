import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
//page
import HomeView from '@/views/HomeView.vue'
import MenView from '@/views/MenView.vue'
import WomanView from '@/views/WomanView.vue'
import KidsView from '@/views/KidsView.vue'
// auth
import AuthView from '@/views/auth/AuthView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
// admin
import AdminDashboardView from '@/views/admin/DashboardView.vue'
import AdminOrderListView from '@/views/admin/orders/OrderListView.vue'
import ProductListView from '@/views/admin/products/ProductListView.vue'
import ProductCreateView from '@/views/admin/products/ProductCreateView.vue'
import ProductEditView from '@/views/admin/products/ProductEditView.vue'
import UserListView from '@/views/admin/users/UserListView.vue'
import UserCreateView from '@/views/admin/users/UserCreateView.vue'
import UserEditView from '@/views/admin/users/UserEditView.vue'
// product
import ProductDetailView from '@/views/ProductDetailView.vue'
// cart
import CartView from '@/views/carts/CartView.vue'
import CheckoutView from '@/views/carts/CheckoutView.vue'
// payment
import PaymentSuccessView from '@/views/payments/PaymentSuccessView.vue'
import PaymentFailedView from '@/views/payments/PaymentFailedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // auth
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      redirect: '/auth/login',
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginView,
        },
        {
          path: 'register',
          name: 'register',
          component: RegisterView,
        },
      ],
    },

    // admin
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/products',
      name: 'admin-products',
      component: ProductListView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: AdminOrderListView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/products/create',
      name: 'admin-products-create',
      component: ProductCreateView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: UserListView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/users/create',
      name: 'admin-users-create',
      component: UserCreateView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/users/:id/edit',
      name: 'admin-users-edit',
      component: UserEditView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/products/:id/edit',
      name: 'admin-products-edit',
      component: ProductEditView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },

    // pages
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/men',
      name: 'men',
      component: MenView,
    },
    {
      path: '/woman',
      name: 'woman',
      component: WomanView,
    },
    {
      path: '/kids',
      name: 'kids',
      component: KidsView,
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetailView,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
      meta: { requiresAuth: true },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/orders',
      name: 'profile-orders',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/payment/success',
      name: 'payment-success',
      component: PaymentSuccessView,
    },
    {
      path: '/payment/failed',
      name: 'payment-failed',
      component: PaymentFailedView,
    },
  ],
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next('/')
  } else {
    next()
  }
})

export default router
