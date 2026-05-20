# StrideFlow Ecommerce

Frontend ecommerce berbasis Vue 3, TypeScript, Pinia, Vue Router, Tailwind CSS v4, Axios, dan checkout Xendit melalui API backend.

## Aspek Penilaian

| Aspek | Implementasi |
| --- | --- |
| Implementasi Vue.js & TypeScript | Menggunakan Composition API, typed route meta, typed API payload, reusable utility response, dan `vue-tsc` untuk validasi tipe. |
| UI/UX dan Tailwind CSS | Responsive layout, navbar mobile, search produk, state loading/error/empty, Tailwind theme token, serta komponen cart/checkout/payment yang konsisten. |
| Routing dan Navigasi | Lazy-loaded route, auth/admin guard, guest redirect, scroll reset, dynamic document title, dan halaman 404. |
| State Management (Pinia) | Store auth, cart, product, dashboard, dan checkout. Cart mendukung varian warna/ukuran, product store mengelola filter dan pencarian, checkout store mengelola invoice Xendit. |
| API Integration (Axios) | Axios instance terpusat, base URL dari environment, bearer token interceptor, 401 cleanup, dan helper error/response. |
| Integrasi Payment Gateway Xendit | Checkout membuat invoice via endpoint `/checkout`, mengambil `payment_url`/`invoice_url`, redirect ke Xendit, dan halaman result membaca query status pembayaran. |
| Clean Code & Maintainability | Struktur modular `components`, `views`, `stores`, `services`, `types`, `utils`, dan dokumentasi environment. |

## Project Setup

```sh
npm install
cp .env.example .env
```

Sesuaikan `VITE_API_BASE_URL` dengan backend Laravel/API yang menyediakan endpoint ecommerce dan Xendit.

## Development

```sh
npm run dev
```

## Build dan Validasi

```sh
npm run type-check
npm run build
npm run lint
```

## Endpoint Backend yang Diharapkan

Frontend memakai prefix API dari `VITE_API_BASE_URL`.

| Flow | Endpoint |
| --- | --- |
| Auth | `POST /login`, `POST /register`, `POST /logout`, `GET /me` |
| Product | `GET /products`, `GET /products/:id`, CRUD admin product |
| Master data | `GET /categories`, `GET /brands`, `GET /genders` |
| Cart/Checkout | `POST /checkout` |
| Admin | `GET /dashboard`, `GET /orders`, CRUD users/products |

Response checkout sebaiknya mengembalikan salah satu field berikut:

```json
{
  "payment_url": "https://checkout.xendit.co/...",
  "invoice_id": "inv-xxx",
  "external_id": "order-xxx",
  "status": "PENDING"
}
```

atau:

```json
{
  "data": {
    "invoice_url": "https://checkout.xendit.co/...",
    "invoice_id": "inv-xxx"
  }
}
```
