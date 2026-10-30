# TechGear - Mobile Accessories E-Commerce & Shop Directory

A modern, high-performance E-commerce platform and Local Shop Directory for mobile accessories, chargers, audio gear, cables, and repair specialists. Built with Next.js 16 (App Router, Turbopack), Tailwind CSS v4, Leaflet maps, and an optional Express/MongoDB backend.

---

## 🌟 Key Features

### 📍 1. Interactive Shop Directory & Store Locator (`/shops`)
- **581+ Verified Shops** across 16 major areas:
  - D Ground (100)
  - Kutchery Bazar (57)
  - Chiniot (53)
  - Gojra (54)
  - Chak Jhumra (48)
  - Samundri (47)
  - Faisalabad (39)
  - Khurrianwala (38)
  - Rex City (32)
  - Hajiabad (29)
  - Jinnah Colony (27)
  - Nishatabad (27)
  - Dijkot (19)
  - Rasool Nagar (6)
  - Nallay Wala (3)
  - Rasool Pur (2)
- **Live Leaflet/OpenStreetMap coordinates mapping**:
  - Color-coded pins for Retail, Accessories, Repair Labs, Computers, and Wholesale.
  - Interactive popups with 1-click **Call**, **WhatsApp chat**, and **Google Maps Directions**.
  - Smooth pan/zoom (`flyTo`) when clicking any shop.
- **Find Near Me (GPS Geolocation)**:
  - Auto-calculates distance in km from user's live position using the Haversine formula.
- **View Modes**:
  - **Split Mode** (Interactive list + sticky Leaflet map side-by-side).
  - **Grid Mode** (Visual card layout).
  - **Full Map Mode** (Maximized map exploration).
- **Dedicated Shop Detail Pages (`/shops/[id]`)**:
  - Pre-rendered with Next.js Static Site Generation (SSG).
  - Dynamic OpenGraph SEO metadata.
  - High-zoom interactive mini-map centered on the shop.
  - One-click copy coordinates, business hours, services, and related nearby shops.

### ⚡ 2. E-Commerce Store
- Category filters (Fast Chargers, Audio & TWS, Durable Cables, Power Banks).
- Shopping Cart powered by Zustand with persistent local storage.
- Search with instant filtering.
- Checkout & Profile management.
- Admin portal for products, orders, and shop settings.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+ or v20+

### Installation & Run

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## ☁️ Vercel Deployment (Production-Ready)

The application is engineered to be **100% production-ready and future-proof for Vercel deployment**:

1. **Push your code to GitHub / GitLab / Bitbucket**.
2. **Import Project in Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and select your repository.
   - Set **Root Directory** to `frontend`.
   - Build Command: `next build` (default).
   - Output Directory: `.next` (default).
   - Install Command: `npm install` (default).
3. **Environment Variables (Optional)**:
   - `NEXT_PUBLIC_API_URL`: If hosting the Express backend on Railway/Render (e.g. `https://your-backend.railway.app/api`). If omitted, Next.js serverless API routes (`/api/shops`, `/api/shops/[id]`) and static dataset handle everything out of the box with zero runtime dependencies!
4. **Deploy!**

---

## 📁 Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/shops/          # Next.js Serverless API endpoints
│   │   │   ├── shops/              # Main Shop Directory & Store Locator
│   │   │   │   └── [id]/           # Individual Shop Detail Pages (SSG + Metadata)
│   │   │   ├── category/           # Product categories
│   │   │   ├── cart/               # Shopping cart
│   │   │   ├── checkout/           # Checkout
│   │   │   ├── page.tsx            # Modern homepage with Shop Directory showcase
│   │   │   └── globals.css         # Tailwind v4 & Leaflet CSS styles
│   │   ├── components/
│   │   │   ├── ShopMap.tsx         # Interactive Leaflet Map for Directory
│   │   │   ├── ShopDetailMap.tsx   # Individual Shop Pinpoint Map
│   │   │   ├── Navbar.tsx          # Main Navigation with Shop Directory link
│   │   │   └── Footer.tsx          # Footer with Shop Directory quick link
│   │   ├── data/
│   │   │   ├── shops.json          # 581 Cleaned, categorized & coordinated shops
│   │   │   └── products.ts         # Products catalog
│   │   └── types/
│   │       └── shop.ts             # TypeScript types for Shop entities
├── backend/
│   ├── controllers/shopController.js # Express directory & settings controller
│   ├── models/Shop.js              # Mongoose schema for Directory + settings
│   ├── routes/shopRoutes.js        # Express routes for /api/shops and /api/shop
│   └── data/shops.json             # Seed source for MongoDB
├── package.json                    # Root workspace runner
└── README.md
```

