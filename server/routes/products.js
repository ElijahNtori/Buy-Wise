const express = require("express");
const router  = express.Router();

const {
  searchProducts,
  getProduct,
  compareProducts,
  getCategories,
  getMarketplaces
} = require("../controllers/productController");

const { getSuggestions } = require("../controllers/suggestionsController");
const { requireAuth } = require("../middleware/auth");

// GET  /api/products/search?q=headphones
router.get("/search", searchProducts);

// GET  /api/products/suggestions?q=head   ← NEW
router.get("/suggestions", getSuggestions);

// GET  /api/products/categories
router.get("/categories", getCategories);

// GET  /api/products/marketplaces
router.get("/marketplaces", getMarketplaces);

// GET  /api/products/:id   (must stay below named routes to avoid matching them)
router.get("/:id", getProduct);

// POST /api/products/compare  { ids: [...] }
router.post("/compare", requireAuth, compareProducts);

module.exports = router;
