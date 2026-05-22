# LOCAL STORE E-COMMERCE PLATFORM

A **beginner-friendly full stack e-commerce project** using:

- Frontend: **HTML + CSS + Vanilla JavaScript**
- Backend: **Node.js + Express**
- Database: **MongoDB**
- Auth: **JWT + bcrypt password hashing**

## Features

- User Authentication
  - Register
  - Login
  - JWT protection for cart + orders
  - Logout (client deletes JWT)
- Product Listing
  - Product image, name, description, price, category, stock
  - Search, filter by category, sort by price/name
- Shopping Cart (Protected)
  - Add to cart
  - Remove from cart
  - Update quantity
  - Total price
- Checkout (Protected)
  - Customer details form
  - Places an order and reduces product stock
- Profile (Protected)
  - User profile details
  - Order history (simple order tracking)
- Optional (simple): Product reviews API route included

---

## Folder Structure

```
local-store-ecommerce-platform/
  frontend/
    index.html
    login.html
    register.html
    checkout.html
    profile.html
    support.html
    css/
      styles.css
    js/
      api.js
      auth.js
      cart.js
      config.js
      login.js
      main.js
      navbar.js
      products.js
      profile.js
      register.js
      checkout.js
      utils.js
  backend/
    server.js
    package.json
    .env.example
    config/
      db.js
      seed.js
      sampleProducts.js
    controllers/
    middleware/
    models/
    routes/
```

---

## Requirements

- Node.js (18+ recommended)
- MongoDB (local installation) **or** MongoDB Atlas

---

## Step-by-step Setup (Local MongoDB)

### 1) Start MongoDB

Make sure MongoDB is running on your machine.

Default local MongoDB URL used in this project:

```
mongodb://127.0.0.1:27017/local_store_ecommerce
```

### 2) Backend install

Open terminal in the `backend` folder:

```bash
cd backend
npm install
```

### 3) Create `.env`

Copy the example file:

```bash
cp .env.example .env
```

Then edit `.env` if needed (especially `JWT_SECRET` and `MONGO_URI`).

### 4) Seed sample products (recommended)

```bash
npm run seed
```

### 5) Run the backend server

Development (auto restart):

```bash
npm run dev
```

or production:

```bash
npm start
```

Server runs at:

- http://localhost:5000

**The backend serves the frontend automatically**, so just open:

- http://localhost:5000

---

## Running Frontend Separately (Optional)

If you want, you can run `frontend/` using VS Code Live Server.

- Keep backend running on `http://localhost:5000`
- Open `frontend/index.html` with Live Server (usually `http://localhost:5500`)
- The frontend auto-detects this and uses `http://localhost:5000` for APIs

---

## REST API Endpoints

### Auth

- `POST /api/auth/register` → register user
- `POST /api/auth/login` → login user
- `POST /api/auth/logout` → returns message (JWT logout is client-side)

### Products

- `GET /api/products` → list products
  - Query params: `search`, `category`, `sort`
  - Sort values: `price_asc`, `price_desc`, `name_asc`, `name_desc`
- `GET /api/products/categories` → list unique categories
- `GET /api/products/:id` → product details
- `POST /api/products/:id/reviews` (protected) → add review (optional)

### Cart (Protected - requires `Authorization: Bearer <token>`)

- `GET /api/cart` → get cart
- `POST /api/cart` → add to cart `{ productId, quantity }`
- `PUT /api/cart/:productId` → update quantity `{ quantity }`
- `DELETE /api/cart/:productId` → remove from cart

### Orders (Protected)

- `POST /api/orders` → place order using cart items + customer details
- `GET /api/orders/my` → list logged-in user orders
- `GET /api/orders/:id` → get single order (simple tracking)

---

## Notes for Beginners

- **JWT** is stored in `localStorage` on the frontend.
- **Protecting routes** is done in two places:
  - Backend: `protect` middleware checks JWT
  - Frontend: `requireAuth()` redirects to login for checkout/profile
- Passwords are never stored in plain text:
  - `bcryptjs` hashes the password before saving it

---

## Common Issues

### MongoDB connection error

- Make sure MongoDB is running
- Check your `.env` → `MONGO_URI`

### Port already in use

Change `PORT` in `.env` (and restart the server).

