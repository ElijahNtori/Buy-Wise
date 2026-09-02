const axios = require("axios");
const BaseAdapter = require("./BaseAdapter");

/**
 * AliExpress adapter using Omkar Cloud Scraper API.
 * Provides real-time data with a clean JSON structure.
 */
class AliExpressAdapter extends BaseAdapter {
  constructor() {
    super("aliexpress");
    this.apiKey = process.env.OMKAR_ALIEXPRESS_KEY;
    this.baseUrl = "https://aliexpress-scraper-api.omkar.cloud/aliexpress";
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "API-Key": this.apiKey,
        "Content-Type": "application/json"
      },
      timeout: 15000
    });
  }

  /**
   * Check if the adapter is properly configured.
   */
  isConfigured() {
    return !!this.apiKey && this.apiKey !== "your_api_key";
  }

  /**
   * Search for products on AliExpress.
   */
  async search(query, filters = {}) {
    try {
      console.log(`[AliExpressOmkar] Searching for: "${query}"...`);
      const response = await this.client.get("/search", {
        params: {
          query: query,
          page: filters.page || 1
        }
      });

      const items = response.data.results || [];
      
      return items.map(p => ({
        id: `ali-${p.id}`,
        marketplace: "aliexpress",
        title: p.title,
        price: parseFloat(p.price) || 0,
        currency: p.currency || "USD",
        rating: p.rating || 0,
        reviewCount: p.orders_count || 0,
        image: p.image_url,
        images: [p.image_url],
        seller: "AliExpress Seller", 
        shipping: "Check Site",
        deliveryDays: 15,
        inStock: true,
        url: `https://www.aliexpress.com/item/${p.id}.html`,
        category: filters.category || "electronics",
        brand: "",
        condition: "New",
        tags: ["aliexpress"]
      }));
    } catch (err) {
      console.error("[AliExpressOmkar] Search failed:", err.message);
      throw err;
    }
  }

  /**
   * Get product details by ID.
   */
  async getById(id) {
    const productId = id.replace("ali-", "");
    try {
      console.log(`[AliExpressOmkar] Fetching details for: ${productId}...`);
      const response = await this.client.get("/product", {
        params: {
          product_id: productId
        }
      });

      const p = response.data;
      if (!p) return null;

      // Find the best price from sku_pricing if regular price is missing
      const salePrice = p.sku_pricing?.[0]?.sale_price || p.price;

      return {
        id: `ali-${p.id}`,
        marketplace: "aliexpress",
        title: p.title,
        price: parseFloat(salePrice) || 0,
        currency: p.currency || "USD",
        rating: p.rating || 0,
        reviewCount: p.orders_count || 0,
        image: p.images?.[0] || p.image_url,
        seller: p.seller?.name || "AliExpress Seller",
        shipping: "Check Site",
        deliveryDays: 15,
        inStock: true,
        url: p.listing_url || `https://www.aliexpress.com/item/${p.id}.html`,
        category: "electronics",
        brand: "",
        condition: "New",
        tags: ["aliexpress"],
        description: p.description || "",
        images: p.images_hd || p.images || []
      };
    } catch (err) {
      console.error("[AliExpressOmkar] getById failed:", err.message);
      return null;
    }
  }
}

module.exports = new AliExpressAdapter();
