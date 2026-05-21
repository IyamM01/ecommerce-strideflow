# StrideFlow Ecommerce

StrideFlow Ecommerce adalah aplikasi frontend toko online berbasis Vue 3 dan TypeScript. Aplikasi ini menyediakan katalog produk, pencarian dan filter produk, detail produk, keranjang belanja, checkout dengan redirect pembayaran Xendit, halaman profil pelanggan, serta dashboard admin untuk mengelola produk, order, user, brand, dan gender.

Frontend ini dirancang untuk terhubung ke backend API, misalnya Laravel API, melalui Axios. Base URL API dapat dikonfigurasi dari environment variable.

## Teknologi

| Teknologi | Kegunaan |
| --- | --- |
| Vue 3 | Framework utama UI dengan Composition API dan Single File Component. |
| TypeScript | Menjaga tipe data payload, response API, store, dan komponen. |
| Vite | Development server, build tool, proxy API lokal, dan alias import. |
| Pinia | State management untuk auth, product, cart, checkout, dan dashboard. |
| Vue Router | Routing halaman publik, auth, customer, admin, dan route guard. |
| Tailwind CSS v4 | Styling utility-first dan theme token global. |
| Axios | HTTP client untuk komunikasi dengan backend API. |
| Lucide Vue | Icon untuk beberapa komponen UI. |
| ESLint, Oxlint, Prettier | Linting dan formatting kode. |

## Fitur Utama

### Customer

- Melihat landing page dengan hero, produk banyak dibeli, dan produk baru launching.
- Melihat katalog semua produk di `/shop`.
- Melihat katalog berdasarkan gender: `/men`, `/woman`, dan `/kids`.
- Mencari produk berdasarkan nama, deskripsi, brand, category, atau gender.
- Memfilter produk berdasarkan category, brand, ukuran, warna, gender, dan harga maksimum.
- Melihat detail produk, gambar produk, informasi stock, variasi warna/ukuran, related products, dan review.
- Menambahkan produk ke cart dengan quantity serta variasi warna/ukuran.
- Login, register, logout, dan redirect otomatis berdasarkan status auth.
- Melihat serta mengubah profil.
- Melihat riwayat order terakhir di halaman profil.

### Checkout dan Payment

- Cart disimpan di `localStorage` sehingga tetap tersedia saat halaman di-refresh.
- Halaman checkout memakai data user login sebagai default customer.
- Checkout mengirim payload ke endpoint `/checkout`.
- Backend mengembalikan URL pembayaran Xendit melalui `payment_url` atau `invoice_url`.
- Aplikasi membersihkan cart lalu redirect ke halaman pembayaran Xendit.
- Halaman result payment membaca query dari callback/redirect pembayaran.

### Admin

- Dashboard admin dengan ringkasan pendapatan, order, produk, user, low stock, recent orders, dan revenue chart.
- Manajemen produk: list, search, create, edit, delete, upload image via `multipart/form-data`.
- Manajemen order: list, search, detail order, detail payment, dan delete.
- Manajemen user: list, create, edit, delete.
- Manajemen brand dan gender: list, search, create, update, delete.
- Route admin dilindungi oleh auth guard dan role `admin`.

## Struktur Folder

```txt
src/
  assets/              Asset global dan CSS utama
  components/          Komponen UI reusable
    admin/             Komponen dashboard admin
    cart/              Komponen cart dan summary
    home/              Komponen home page
    product-detail/    Komponen halaman detail produk
    products/          Komponen katalog, card, filter, search
    profile/           Komponen halaman profil
  composables/         Logic reusable berbasis Composition API
  layouts/             Layout halaman
  router/              Konfigurasi route dan navigation guard
  services/            Axios service untuk komunikasi API
  stores/              Pinia stores
  types/               TypeScript interface dan payload type
  utils/               Helper response API, currency, payment query
  views/               Halaman utama aplikasi
```

## Prasyarat

- Node.js `^20.19.0` atau `>=22.12.0`
- npm
- Backend API ecommerce yang menyediakan endpoint sesuai kontrak pada bagian "Kontrak Backend API"
- Xendit sudah dikonfigurasi di sisi backend untuk proses invoice/payment

## Instalasi

```sh
npm install
cp .env.example .env
```

Sesuaikan isi `.env` dengan alamat backend:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_WITH_CREDENTIALS=false
```

Jika `VITE_API_BASE_URL` tidak diisi, Axios akan memakai fallback `/api`. Vite juga menyediakan proxy `/api` ke `http://localhost:8000` pada mode development.

## Menjalankan Project

```sh
npm run dev
```

Setelah dev server aktif, buka URL yang ditampilkan oleh Vite, biasanya:

```txt
http://localhost:5173
```

## Script NPM

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan Vite development server. |
| `npm run build` | Menjalankan type-check lalu build production. |
| `npm run build-only` | Build production tanpa type-check. |
| `npm run preview` | Preview hasil build production. |
| `npm run type-check` | Validasi TypeScript dan Vue SFC dengan `vue-tsc`. |
| `npm run lint` | Menjalankan Oxlint dan ESLint. |
| `npm run format` | Format file di `src/` dengan Prettier. |

## Konfigurasi Environment

| Variable | Default | Keterangan |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Base URL request API. Contoh: `http://localhost:8000/api`. |
| `VITE_API_WITH_CREDENTIALS` | `false` | Jika `true`, request Axios mengirim cookie credential. |

Konfigurasi Axios berada di `src/services/api.ts`. Token dari `localStorage` akan dikirim sebagai Bearer token pada header `Authorization`.

## Routing

| Path | Nama Route | Akses | Halaman |
| --- | --- | --- | --- |
| `/` | `home` | Publik | Home page |
| `/shop` | `shop` | Publik | Semua produk |
| `/men` | `men` | Publik | Katalog produk pria |
| `/woman` | `woman` | Publik | Katalog produk wanita |
| `/kids` | `kids` | Publik | Katalog produk anak |
| `/products/:id` | `product-detail` | Publik | Detail produk |
| `/auth/login` | `login` | Guest only | Login |
| `/auth/register` | `register` | Guest only | Register |
| `/cart` | `cart` | Login | Keranjang |
| `/checkout` | `checkout` | Login | Checkout |
| `/profile` | `profile` | Login | Profil user |
| `/profile/orders` | `profile-orders` | Login | Profil dan section order |
| `/payment/success` | `payment-success` | Publik | Hasil pembayaran berhasil |
| `/payment/failed` | `payment-failed` | Publik | Hasil pembayaran gagal |
| `/admin` | `admin` | Admin | Dashboard admin |
| `/admin/products` | `admin-products` | Admin | List produk |
| `/admin/products/create` | `admin-products-create` | Admin | Tambah produk |
| `/admin/products/:id/edit` | `admin-products-edit` | Admin | Edit produk |
| `/admin/orders` | `admin-orders` | Admin | List order |
| `/admin/users` | `admin-users` | Admin | List user |
| `/admin/users/create` | `admin-users-create` | Admin | Tambah user |
| `/admin/users/:id/edit` | `admin-users-edit` | Admin | Edit user |
| `/admin/brands` | `admin-brands` | Admin | Manajemen brand |
| `/admin/genders` | `admin-genders` | Admin | Manajemen gender |
| `/:pathMatch(.*)*` | `not-found` | Publik | 404 |

Route guard berada di `src/router/index.ts`:

- `requiresAuth`: user harus login.
- `requiresAdmin`: user harus login dan memiliki `role === 'admin'`.
- `guestOnly`: user yang sudah login akan diarahkan ke home atau dashboard admin.
- Setiap navigasi mengubah `document.title` dengan format `<title> | StrideFlow`.

## State Management

| Store | File | Tanggung Jawab |
| --- | --- | --- |
| Auth | `src/stores/authStore.ts` | Login, register, logout, menyimpan user dan token. |
| Product | `src/stores/productStore.ts` | Fetch produk, detail produk, CRUD produk, search, filter katalog. |
| Cart | `src/stores/cartStore.ts` | Menyimpan cart, quantity, total item, total harga, varian warna/ukuran. |
| Checkout | `src/stores/checkoutStore.ts` | Membuat invoice checkout, menyimpan payment aktif dan hasil payment. |
| Dashboard | `src/stores/dashboardStore.ts` | Mengambil data ringkasan admin dashboard. |

Data yang disimpan di `localStorage`:

| Key | Isi |
| --- | --- |
| `token` | Bearer token dari backend. |
| `user` | Data user login. |
| `isLoggedIn` | Status login sederhana untuk inisialisasi store. |
| `cart` | Item cart lokal. |

## Kontrak Backend API

Frontend memakai prefix dari `VITE_API_BASE_URL`. Semua endpoint di bawah relatif terhadap base URL tersebut.

### Auth

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| `POST` | `/login` | Login user. |
| `POST` | `/register` | Register user. |
| `POST` | `/logout` | Logout user. |
| `GET` | `/me` | Mengambil user login. |

Response login/register:

```json
{
  "user": {
    "id": 1,
    "name": "Customer",
    "email": "customer@example.com",
    "phone": "08123456789",
    "role": "customer"
  },
  "token": "plain-text-token",
  "type": "Bearer"
}
```

### Product dan Master Data

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| `GET` | `/products` | Mengambil semua produk. |
| `GET` | `/products/:id` | Mengambil detail produk. |
| `POST` | `/products` | Membuat produk baru dengan `multipart/form-data`. |
| `POST` | `/products/:id` | Update produk dengan `_method=PUT` dan `multipart/form-data`. |
| `DELETE` | `/products/:id` | Menghapus produk. |
| `GET` | `/categories` | Mengambil category. |
| `GET` | `/brands` | Mengambil brand. |
| `POST` | `/brands` | Membuat brand. |
| `PUT` | `/brands/:id` | Update brand. |
| `DELETE` | `/brands/:id` | Hapus brand. |
| `GET` | `/genders` | Mengambil gender. |
| `POST` | `/genders` | Membuat gender. |
| `PUT` | `/genders/:id` | Update gender. |
| `DELETE` | `/genders/:id` | Hapus gender. |

Frontend menerima response collection dalam bentuk langsung atau dibungkus `data`:

```json
[
  {
    "id": 1,
    "name": "Running Shoes",
    "slug": "running-shoes",
    "description": "Sepatu olahraga",
    "price": 350000,
    "stock": 20,
    "image_url": "https://example.com/image.jpg",
    "category_id": 1,
    "brand_id": 1,
    "gender_id": 1
  }
]
```

atau:

```json
{
  "success": true,
  "message": "OK",
  "data": []
}
```

### Review

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| `GET` | `/products/:productId/reviews` | Mengambil review produk. |
| `POST` | `/products/:productId/reviews` | Mengirim review produk. |

Response review:

```json
{
  "status": true,
  "avg_rating": 4.5,
  "review_count": 2,
  "data": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Produk bagus",
      "user": {
        "id": 1,
        "name": "Customer"
      },
      "created_at": "2026-01-01T10:00:00.000000Z"
    }
  ]
}
```

### Checkout dan Payment

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| `POST` | `/checkout` | Membuat order dan invoice pembayaran Xendit. |

Payload checkout:

```json
{
  "customer_name": "Customer",
  "customer_email": "customer@example.com",
  "customer_phone": "08123456789",
  "shipping_address": "Jl. Contoh No. 1",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 350000
    }
  ]
}
```

Response checkout yang didukung:

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
  "success": true,
  "message": "Invoice created",
  "data": {
    "invoice_url": "https://checkout.xendit.co/...",
    "invoice_id": "inv-xxx",
    "external_id": "order-xxx",
    "status": "PENDING"
  }
}
```

### Order, User, dan Dashboard Admin

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| `GET` | `/dashboard` | Mengambil ringkasan dashboard admin. |
| `GET` | `/orders` | Mengambil semua order. |
| `GET` | `/orders/:id` | Mengambil detail order. |
| `DELETE` | `/orders/:id` | Menghapus order. |
| `GET` | `/users` | Mengambil semua user. |
| `GET` | `/users/:id` | Mengambil detail user. |
| `POST` | `/users` | Membuat user. |
| `PUT` | `/users/:id` | Update user atau profil. |
| `DELETE` | `/users/:id` | Menghapus user. |

Response dashboard:

```json
{
  "stats": {
    "total_sales": 1500000,
    "total_orders": 10,
    "total_products": 25,
    "total_users": 8
  },
  "low_stock": [],
  "recent_orders": [],
  "revenue_chart": []
}
```

## Alur Checkout Xendit

1. User login dan menambahkan produk ke cart.
2. User membuka `/checkout`.
3. Form checkout mengirim `customer_name`, `customer_email`, `customer_phone`, `shipping_address`, dan `items`.
4. `checkoutStore.createInvoice()` memanggil `checkoutService.createXenditInvoice()`.
5. Backend membuat order dan invoice Xendit.
6. Backend mengembalikan `payment_url` atau `invoice_url`.
7. Frontend menghapus cart dan menjalankan `window.location.assign(redirectUrl)`.
8. Setelah pembayaran, Xendit/backend dapat mengarahkan user ke `/payment/success` atau `/payment/failed` dengan query seperti `status`, `invoice_id`, `external_id`, `payment_method`, dan `paid_at`.

## Model Data Ringkas

### Product

```ts
interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  stock: number
  image_url: string
  category_id: number
  brand_id: number
  gender_id: number
  size?: string
  color?: string
  sku?: string
  badge?: string
}
```

### User

```ts
interface User {
  id: number
  name: string
  email: string
  phone?: string
  role?: string
}
```

### Order

```ts
interface Order {
  id: number
  order_code: string
  total_price: number
  status: string
  items: OrderItem[]
  payment?: OrderPayment | null
  created_at: string
  updated_at: string
}
```

## Pola Kode

- Gunakan alias `@/` untuk import dari `src/`.
- Service API diletakkan di `src/services`.
- Tipe data diletakkan di `src/types`.
- Logic yang cukup besar dan reusable diletakkan di `src/composables`.
- State lintas halaman dikelola dengan Pinia store di `src/stores`.
- Format uang memakai locale `id-ID` dan currency `IDR`.
- Helper `unwrapResource` dan `unwrapCollection` dipakai agar frontend kompatibel dengan response API langsung maupun response yang dibungkus `data`.

## Validasi Sebelum Deploy

Jalankan perintah berikut sebelum deploy atau presentasi:

```sh
npm run type-check
npm run build
npm run lint
```

Untuk preview hasil build:

```sh
npm run preview
```

## Troubleshooting

| Masalah | Solusi |
| --- | --- |
| API tidak terpanggil | Cek `VITE_API_BASE_URL` di `.env` dan pastikan backend aktif. |
| Request 401 | Login ulang, cek token backend, dan pastikan endpoint membutuhkan Bearer token yang sama. |
| Cart hilang setelah checkout | Ini normal karena cart dibersihkan sebelum redirect ke Xendit. |
| Payment tidak redirect | Pastikan response `/checkout` berisi `payment_url` atau `invoice_url`. |
| Admin tidak bisa dibuka | Pastikan user login memiliki `role` bernilai `admin`. |
| Gambar produk tidak tampil | Pastikan backend mengirim `image_url` yang bisa diakses browser. |
| Build gagal karena tipe data | Jalankan `npm run type-check` dan cocokkan response backend dengan interface di `src/types`. |

## Aspek Penilaian

| Aspek | Implementasi |
| --- | --- |
| Implementasi Vue.js dan TypeScript | Menggunakan Composition API, typed route meta, typed API payload, reusable utility response, dan `vue-tsc` untuk validasi tipe. |
| UI/UX dan Tailwind CSS | Responsive layout, navbar mobile, search produk, state loading/error/empty, Tailwind theme token, serta komponen cart/checkout/payment yang konsisten. |
| Routing dan Navigasi | Lazy-loaded route, auth/admin guard, guest redirect, scroll reset, dynamic document title, dan halaman 404. |
| State Management Pinia | Store auth, cart, product, dashboard, dan checkout. Cart mendukung varian warna/ukuran, product store mengelola filter dan pencarian, checkout store mengelola invoice Xendit. |
| API Integration Axios | Axios instance terpusat, base URL dari environment, bearer token interceptor, 401 cleanup, dan helper error/response. |
| Integrasi Payment Gateway Xendit | Checkout membuat invoice via endpoint `/checkout`, mengambil `payment_url`/`invoice_url`, redirect ke Xendit, dan halaman result membaca query status pembayaran. |
| Clean Code dan Maintainability | Struktur modular `components`, `views`, `stores`, `services`, `types`, `utils`, dan dokumentasi environment. |
