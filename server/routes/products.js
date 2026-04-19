const express = require("express");
const router = express.Router();
const {
  searchProducts,
  getProduct,
  compareProducts,
  getCategories,
  getMarketplaces
} = require("../controllers/productController");

// GET  /api/products/search?q=headphones
router.get("/search", searchProducts);

// GET  /api/products/categories
router.get("/categories", getCategories);

// GET  /api/products/marketplaces
router.get("/marketplaces", getMarketplaces);

// GET  /api/products/:id
router.get("/:id", getProduct);

// POST /api/products/compare  { ids: [...] }
router.post("/compare", compareProducts);

module.exports = router;
