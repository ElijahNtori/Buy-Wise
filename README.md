# ⚡ Buy-Wise — Multi-Marketplace Product Comparison Platform

> **Group 18A · Department of Information Technology and Decision Sciences**  
> *BSc Project: Buy-Wise: A Multi-Marketplace E-Commerce Product Comparison*

A full-stack web application that lets users **search, compare, and redirect** to products across Amazon, eBay, AliExpress, and Jumia — all from one clean interface.

---

## 📸 Features

| Feature | Description |
|---|---|
| 🔍 **Product Search** | Search across all 4 marketplaces simultaneously |
| ⚖️ **Side-by-Side Comparison** | Compare up to 4 products on price, rating, shipping & more |
| 🏷️ **Marketplace Filter** | Filter by Amazon, eBay, AliExpress, or Jumia |
| 📊 **Sort & Filter** | Sort by price, rating, or popularity; filter by category & price range |
| 🛒 **Buy Now Redirect** | One-click redirect to the original marketplace listing |
| ✨ **Best Value Highlights** | Auto-highlights cheapest, top-rated, and fastest delivery |
| 📱 **Responsive Design** | Works great on desktop, tablet, and mobile |
| ⚡ **In-Memory Cache** | Search results cached for 5 minutes to reduce API load |

---

## 🏗️ Architecture

```
buywise/
├── backend/                  # Node.js + Express API
│   ├── server.js             # Entry point (CORS, rate limiting, helmet)
│   ├── routes/
│   │   └── products.js       # RESTful product routes
│   ├── controllers/
│   │   └── productController.js  # Business logic + caching
│   ├── data/
│   │   └── mockProducts.js   # Mock data (replace with real API calls)
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── App.js            # Root component with Router
│   │   ├── index.js          # React entry point
│   │   ├── index.css         # Global design system (CSS variables)
│   │   ├── components/
│   │   │   ├── Navbar.js/.css         # Sticky nav with compare counter
│   │   │   ├── SearchBar.js/.css      # Search input with suggestions
│   │   │   ├── ProductCard.js/.css    # Product cards with compare toggle
│   │   │   ├── FilterPanel.js/.css    # Sort & filter controls
│   │   │   └── CompareBar.js/.css     # Floating compare tray
│   │   ├── pages/
│   │   │   ├── HomePage.js/.css       # Landing page with hero
│   │   │   ├── SearchPage.js/.css     # Search results grid
│   │   │   └── ComparePage.js/.css    # Full comparison table
│   │   ├── context/
│   │   │   └── CompareContext.js      # Global compare state (React Context)
│   │   ├── hooks/
│   │   │   └── useSearch.js           # Search async hook
│   │   └── utils/
│   │       └── api.js                 # Centralized API client
│   ├── public/index.html
│   ├── nginx.conf            # Production nginx config
│   └── Dockerfile
│
├── docker-compose.yml        # Full-stack Docker setup
├── package.json              # Root scripts (concurrently)
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js** v18+ and npm
- **MongoDB** (optional — only needed for caching/user accounts)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd buywise

# Install all dependencies in one command
npm run install:all
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
# Edit .env — at minimum set PORT=5000
```

### 3. Run Both Servers

From the **root** directory:

```bash
# Install the root concurrently tool first
npm install

# Start backend (port 5000) + frontend (port 3000) together
npm run dev
```

Or run them separately:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend  
cd frontend && npm start
```

### 4. Open in Browser

- **Frontend:** http://localhost:3000
- **API:**       http://localhost:5000/api/health

---

## 🐳 Docker (Production)

```bash
# Build and start all services
docker-compose up --build

# Stop
docker-compose down
```

Access at: http://localhost:3000

---

## 🔌 API Reference

All endpoints are prefixed with `/api`.

### Search Products
```
GET /api/products/search?q=headphones
```
| Query Param | Type | Description |
|---|---|---|
| `q` | string (required) | Search keyword |
| `marketplace` | string | `amazon` \| `ebay` \| `aliexpress` \| `jumia` \| `all` |
| `category` | string | `electronics` \| `fashion` \| `home` \| `all` |
| `minPrice` | number | Minimum price in USD |
| `maxPrice` | number | Maximum price in USD |
| `minRating` | number | Minimum rating (0–5) |
| `sortBy` | string | `price_asc` \| `price_desc` \| `rating` \| `popularity` \| `relevance` |

**Example Response:**
```json
{
  "success": true,
  "query": "headphones",
  "total": 3,
  "byMarketplace": { "amazon": 2, "ebay": 1 },
  "products": [...]
}
```

### Compare Products
```
POST /api/products/compare
Content-Type: application/json

{ "ids": ["amz-001", "ebay-001", "ali-001"] }
```

### Get Single Product
```
GET /api/products/:id
```

### List Marketplaces
```
GET /api/products/marketplaces
```

### Health Check
```
GET /api/health
```

---

## 🔧 Integrating Real APIs

The mock data in `backend/data/mockProducts.js` is designed to be a drop-in replacement. To connect real marketplace APIs:

### Amazon Product Advertising API (PA-API 5.0)
```js
// In productController.js, replace searchProducts() with:
const AmazonPaapi = require("amazon-paapi");
const results = await AmazonPaapi.SearchItems({ Keywords: query, ... });
```

### eBay Browse API
```js
// GET https://api.ebay.com/buy/browse/v1/item_summary/search?q=...
// Requires free eBay Developer account → App ID
const response = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${query}`, {
  headers: { Authorization: `Bearer ${process.env.EBAY_TOKEN}` }
});
```

### RapidAPI (AliExpress & Jumia)
```
Host: aliexpress-datahub.p.rapidapi.com
X-RapidAPI-Key: your_key
```

---

## 📋 Mock Data Structure

Each product follows this schema:

```js
{
  id: "amz-001",              // Unique ID
  marketplace: "amazon",      // amazon | ebay | aliexpress | jumia
  title: "Product name",
  price: 279.99,              // USD
  currency: "USD",
  rating: 4.7,                // 0–5
  reviewCount: 12453,
  image: "https://...",
  seller: "Seller Name",
  shipping: "Free",           // or "$5.99"
  deliveryDays: 2,
  inStock: true,
  url: "https://...",         // Original marketplace URL
  category: "electronics",
  brand: "Sony",
  condition: "New",           // New | Used | Refurbished
  tags: ["headphones", ...]
}
```

---

## 🛣️ Roadmap / Optional Features

- [ ] **User Accounts** — Save comparisons, wishlists (JWT + MongoDB)
- [ ] **Price Alerts** — Email/push notification when price drops
- [ ] **Price History** — Track price changes over time (cron job + MongoDB)
- [ ] **Dark Mode** — CSS variable swap
- [ ] **Share Comparison** — Shareable URL for a comparison session
- [ ] **Browser Extension** — Compare while browsing any marketplace

---

## 📚 References

- Laudon, K. C., & Traver, C. G. (2022). *E-commerce: Business, technology, society* (17th ed.). Pearson.
- Chaffey, D. (2019). *Digital business and e-commerce management* (7th ed.). Pearson.
- Turban, E., et al. (2018). *Electronic commerce: A managerial and social networks perspective*. Springer.

---

## 👥 Team

**Group 18A** · Department of Information Technology and Decision Sciences

---

*Buy-Wise does not process purchases — it redirects users to original marketplace listings only.*
