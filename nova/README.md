# NOVA — Full Stack E-commerce Application

A full-stack e-commerce demo built for a Full Stack Web Developer technical
assessment: a fashion/lifestyle storefront ("NOVA") with a real backend, a
MongoDB database, a shopping cart, checkout, and an admin dashboard with
product management and analytics.

## Overview

NOVA is a two-part application:

- **frontend/** — React (Vite) storefront and admin dashboard
- **backend/** — Node.js/Express REST API backed by MongoDB

The storefront lets a visitor browse products, search and filter, view a
product page, add items to a cart (persisted in `localStorage`), and check
out with a demo (non-payment) checkout form. The admin dashboard lets a
logged-in admin manage products and view sales/analytics charts backed by
real data in MongoDB.

## Features

- Product catalog served from MongoDB via a REST API (search, category
  filter, price/rating sorting)
- Product details page with related products
- Cart with quantity controls, persisted in `localStorage`
- Demo checkout flow (no real payment) that creates a real `Order` document
  and decrements stock
- Admin login (JWT + bcrypt password hashing)
- Admin dashboard: overview cards, revenue/orders charts (Recharts), category
  distribution, recent orders, low-stock list
- Admin product CRUD (create, edit, delete, search, filter) with confirm-
  before-delete and toast notifications
- Centralized error handling, loading/empty/error states throughout
- Seed script with a demo admin account, 15 products and ~22 sample orders

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Recharts
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

JavaScript only (no TypeScript), kept intentionally simple to explain in an
interview.

## Project Structure

```
nova/
├── backend/
│   ├── config/        # DB connection, shared constants
│   ├── controllers/    # Route handler logic
│   ├── middleware/     # auth, admin, error handling
│   ├── models/         # Mongoose schemas (Product, Order, User)
│   ├── routes/         # Express routers
│   ├── seed/           # Seed script + demo product data
│   ├── utils/           # asyncHandler, createError, pricing helpers
│   └── server.js
└── frontend/
    └── src/
        ├── components/  # Navbar, Footer, ProductCard, AdminSidebar, etc.
        ├── pages/        # Home, Shop, ProductDetails, Cart, Checkout, About
        │   └── admin/     # AdminLogin, Dashboard, Products, Orders, Analytics
        ├── layouts/      # MainLayout, AdminLayout
        ├── context/      # CartContext, AuthContext
        ├── services/     # Axios calls per resource
        ├── hooks/        # useToast
        └── utils/        # formatPrice, formatDate
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database — either local (`mongod`) or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGODB_URI, JWT_SECRET, CLIENT_URL
npm run seed   # creates the admin account, products and sample orders
npm run dev    # starts the API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env: set VITE_API_URL (defaults to http://localhost:5000/api)
npm run dev    # starts the app on http://localhost:5173
```

Open http://localhost:5173 for the storefront, and
http://localhost:5173/admin/login for the admin dashboard.

## Environment Variables

**backend/.env**

| Variable      | Description                                      |
|---------------|---------------------------------------------------|
| `PORT`        | API port (default 5000)                           |
| `MONGODB_URI` | MongoDB connection string                          |
| `JWT_SECRET`  | Random secret used to sign admin JWTs              |
| `CLIENT_URL`  | Allowed frontend origin(s) for CORS, comma-separated |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Used only by `npm run seed` |

**frontend/.env**

| Variable        | Description                    |
|-----------------|---------------------------------|
| `VITE_API_URL`  | Base URL of the backend API     |

## Seed Data

`npm run seed` (run from `backend/`) will **clear** the Product, Order and
User collections and recreate:

- 1 admin account (see credentials below)
- 15 demo products across 5 categories
- ~22 demo orders spread over the last 30 days, with randomized status

**The seeded orders are sample/demo records only**, created so the analytics
dashboard has data to show on a fresh database — they are not real customer
orders.

## Admin Login

Demo credentials (from the default `.env.example` values — change them in
your own `.env` before deploying):

```
Email:    admin@nova.com
Password: Admin@123
```

These are development/demo credentials only and should never be used as-is
in a real deployment.

## API Endpoints

| Method | Endpoint                  | Auth        | Description               |
|--------|----------------------------|-------------|----------------------------|
| GET    | /api/products               | Public      | List products (search, category, sort, limit query params) |
| GET    | /api/products/:id           | Public      | Get a single product      |
| POST   | /api/products               | Admin       | Create a product          |
| PUT    | /api/products/:id           | Admin       | Update a product          |
| DELETE | /api/products/:id           | Admin       | Delete a product          |
| POST   | /api/auth/login              | Public      | Admin login, returns JWT  |
| GET    | /api/auth/me                 | Admin       | Current admin profile     |
| POST   | /api/orders                  | Public      | Place an order (checkout) |
| GET    | /api/orders                  | Admin       | List all orders           |
| GET    | /api/orders/:id               | Admin       | Get a single order        |
| GET    | /api/analytics/overview       | Admin       | Dashboard summary cards   |
| GET    | /api/analytics/sales?days=30  | Admin       | Daily revenue/orders series |
| GET    | /api/health                   | Public      | Health check               |

## Deployment

- **Frontend → Vercel**: set the project root to `frontend/`, build command
  `npm run build`, output directory `dist`. Add `VITE_API_URL` pointing at
  your deployed backend as an environment variable.
- **Backend → Render**: set the root to `backend/`, build command
  `npm install`, start command `npm start`. Add `MONGODB_URI`, `JWT_SECRET`,
  and `CLIENT_URL` (your deployed frontend URL) as environment variables.
- **Database → MongoDB Atlas**: create a free cluster, add a database user,
  allow network access from Render (or `0.0.0.0/0` for simplicity in a demo),
  and use its connection string as `MONGODB_URI`.

No `localhost` URLs are hardcoded — the API base URL and CORS origin are
both read from environment variables. `.env` files are git-ignored; only
`.env.example` files are committed.

## Important note on how this was built

This project was generated and reviewed by an AI coding assistant working
in a **sandboxed environment without internet/npm registry access**. Every
file's syntax was checked manually (brace/import verification), but
`npm install`, `npm run dev`, and `npm run build` could **not** be executed
in that sandbox. **Please run `npm install` and `npm run dev` yourself
after downloading the project**, and fix any small issues that come up
(e.g. a dependency version mismatch) before your assessment. Everything was
written carefully and reviewed line-by-line, but this is the one step that
genuinely needs verifying on your machine.

## Future Improvements

Realistic next steps, not implemented here:

- Real payment gateway integration (e.g. Razorpay/Stripe)
- Image upload/storage instead of image URLs
- Persistent customer accounts and order history/tracking
- Email notifications on order placement
- Pagination on the product listing and admin tables
- More advanced analytics (cohort/retention, top products)
