const NodeCache = require("node-cache");
const SearchService = require("../services/SearchService");

// In-memory cache: TTL from env (default 5 min)
const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 300 });

/**
 * Helper to ensure No complex objects (like SerpApi's {raw, extracted}) 
 * reach the React frontend where they would cause a crash.
 */
function sanitizeValue(val) {
  if (val && typeof val === "object" && !Array.isArray(val)) {
    // Priority: extracted (SerpApi) > amount (various) > value (RapidAPI/others)
    if (val.extracted !== undefined) return val.extracted;
    if (val.amount !== undefined) return val.amount;
    if (val.value !== undefined) return val.value;
    
    // If it has "raw" but no "extracted", use raw as string
    if (val.raw !== undefined && typeof val.raw === "string") return val.raw;
  }
  return val;
}

function sanitizeProduct(p) {
  if (!p) return p;
  const sanitized = { ...p };
  Object.keys(sanitized).forEach(key => {
    sanitized[key] = sanitizeValue(sanitized[key]);
  });
  return sanitized;
}

/**
 * GET /api/products/search?q=...&marketplace=...&category=...
 *      &minPrice=...&maxPrice=...&minRating=...&sortBy=...
 */
exports.searchProducts = async (req, res) => {
  try {
    const { q, marketplace, category, minPrice, maxPrice, minRating, sortBy } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters"
      });
    }

    // Build cache key from full query string
    const cacheKey = `search:${JSON.stringify(req.query)}`;
    
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, fromCache: true, ...cached });
    }

    // Use SearchService to fetch results from active adapters
    const results = await SearchService.search(q.trim(), {
      marketplace,
      category,
      minPrice,
      maxPrice,
      minRating,
      sortBy
    });

    // Group by marketplace for summary
    const byMarketplace = results.reduce((acc, p) => {
      acc[p.marketplace] = (acc[p.marketplace] || 0) + 1;
      return acc;
    }, {});

    const payload = {
      query: q.trim(),
      total: results.length,
      byMarketplace,
      products: results.map(sanitizeProduct)
    };

    cache.set(cacheKey, payload);

    res.json({ success: true, fromCache: false, ...payload });
  } catch (err) {
    console.error("searchProducts error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * GET /api/products/:id
 */
exports.getProduct = async (req, res) => {
  try {
    const product = await SearchService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product: sanitizeProduct(product) });
  } catch (err) {
    console.error("getProduct error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * POST /api/products/compare
 */
exports.compareProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Provide at least 2 product IDs to compare"
      });
    }

    const products = await SearchService.getProductsByIds(ids);
    if (products.length < 2) {
      return res.status(404).json({
        success: false,
        message: "Not enough valid product IDs"
      });
    }

    // Build comparison matrix
    const fields = ["price", "rating", "reviewCount", "shipping", "deliveryDays", "condition", "seller", "marketplace"];
    const comparison = fields.map(field => ({
      field,
      values: products.map(p => ({ id: p.id, value: p[field] }))
    }));

    // Highlights
    const cheapest = [...products].sort((a, b) => a.price - b.price)[0];
    const topRated = [...products].sort((a, b) => b.rating - a.rating)[0];
    const fastestShipping = [...products].sort((a, b) => a.deliveryDays - b.deliveryDays)[0];

    res.json({
      success: true,
      products: products.map(sanitizeProduct),
      comparison,
      highlights: {
        cheapest: cheapest.id,
        topRated: topRated.id,
        fastestShipping: fastestShipping.id
      }
    });
  } catch (err) {
    console.error("compareProducts error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * GET /api/products/categories
 */
exports.getCategories = async (req, res) => {
  try {
    const { mockProducts } = require("../data/mockProducts");
    const categories = [...new Set(mockProducts.map(p => p.category))];
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

/**
 * GET /api/products/marketplaces
 */
exports.getMarketplaces = (req, res) => {
  res.json({
    success: true,
    marketplaces: [
      { id: "amazon", name: "Amazon", color: "#FF9900", logo: "🛒" },
      { id: "ebay", name: "eBay", color: "#E53238", logo: "🏷️" },
      { id: "aliexpress", name: "AliExpress", color: "#FF6600", logo: "🌐" },
      { id: "alibaba", name: "Alibaba", color: "#FF6A00", logo: "🏭" }
    ]
  });
};
