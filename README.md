# Buy-Wise

Buy-Wise is a full-stack product comparison app for searching, saving, and comparing products across Amazon, eBay, AliExpress, and Alibaba.

## Features

- Multi-marketplace product search with filtering and sorting
- Side-by-side comparison for saved products
- Wishlist and recently viewed products
- Optional user accounts for cross-device sync
- Daily exchange-rate refresh for GHS pricing through Fixer.io
- Responsive React UI with Vite
- Express API with rate limiting, CORS, Helmet, and adapter-based marketplace integrations

## Project Structure

```text
buywise/
  client/                 React + Vite frontend
  server/                 Node.js + Express API
  docker-compose.yml      Full-stack Docker setup
  package.json            Root helper scripts
```

## Local Setup

```bash
npm run install:all
npm run dev
```

Frontend: http://localhost:3000  
API: http://localhost:5000/api/health

## Environment

Create `server/.env` from `server/.env.example`.

Important variables:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
FIXER_API_KEY=your_fixer_api_key
EXCHANGE_RATE_USD_GHS=14.50
JWT_SECRET=replace_with_a_long_random_secret
```

Do not commit real API keys. If a key has been shared publicly, rotate it in the provider dashboard.

For the frontend, optional Vite variables can be placed in `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_EXCHANGE_RATE=14.50
```

## Scripts

```bash
npm run dev                 # start server and client
npm run build               # build the client
npm test --prefix client    # run frontend tests
npm run dev --prefix server # start only the API
npm start --prefix client   # start only the frontend
```

## API Highlights

- `GET /api/products/search?q=headphones`
- `POST /api/products/compare`
- `GET /api/products/marketplaces`
- `GET /api/exchange-rates`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/sync`
- `PUT /api/auth/wishlist`
- `PUT /api/auth/recently-viewed`

## Exchange Rates

The server refreshes Fixer.io rates once per day and stores the latest snapshot locally. Product prices are normalized to GHS on the server. If Fixer is not configured or unavailable, the app falls back to `EXCHANGE_RATE_USD_GHS`.

## Account Sync

Anonymous users still use localStorage. Once a user signs in, the app merges local wishlist and recently viewed items into the server-backed account so they can sync across devices.

The current account store is file-backed for demo/development use. For production, replace it with MongoDB or another persistent database.

## Docker

```bash
docker-compose up --build
docker-compose down
```

The frontend is served through nginx on port `3000`, and API requests are proxied to the backend service.
