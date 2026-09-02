/**
 * Buy-Wise Backend Server
 * Multi-Marketplace Product Comparison API
 */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express      = require("express");
const cors         = require("cors");
const helmet       = require("helmet");
const morgan       = require("morgan");
const rateLimit    = require("express-rate-limit");

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const exchangeRateService = require("./services/ExchangeRateService");

// ─── Database Connection ─────────────────────────────────────────────────────
// Supabase connection is handled in config/supabase.js
console.log("🔌 Using Supabase for database");

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Middleware ─────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  // FIX: When FRONTEND_URL is not set in production, origin was undefined,
  // which caused express-cors to silently allow ALL origins (same as wildcard).
  // Using `false` instead explicitly rejects all cross-origin requests when
  // the env var is missing, preventing accidental public API exposure.
  origin: process.env.NODE_ENV === "production"
    ? (process.env.FRONTEND_URL || false)
    : ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limiting: 100 requests per 15 minutes per IP (relaxed in development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." }
});
app.use("/api", limiter);

// ─── Routes ───────────────────────────────────────────────────────────────
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/exchange-rates", (req, res) => {
  res.json({
    success: true,
    usdToGhs: exchangeRateService.getUsdToGhs(),
    ...exchangeRateService.getSnapshot()
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Buy-Wise API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Something went wrong on our end" });
});

// ─── Start ────────────────────────────────────────────────────────────────
exchangeRateService.init().catch(err => {
  console.warn("[server] Exchange rate initialization failed:", err.message);
});

// Only listen if not running in Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Buy-Wise API running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health\n`);

    // Warn loudly if FRONTEND_URL is missing in production
    if (process.env.NODE_ENV === "production" && !process.env.FRONTEND_URL) {
      console.warn("⚠️  WARNING: FRONTEND_URL is not set. CORS will reject all cross-origin requests.");
    }
  });
}

module.exports = app;
