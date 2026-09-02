const axios = require("axios");
const BaseAdapter = require("./BaseAdapter");

/**
 * Amazon adapter using Omkar Cloud Scraper API.
 * This replaces the previous RapidAPI implementation for better accuracy and real-time data.
 */
class AmazonAdapter extends BaseAdapter {
  constructor() {
    super("amazon");
    this.apiKey = process.env.OMKAR_AMAZON_KEY;
    this.baseUrl = "https://amazon-scraper-api.omkar.cloud/amazon";
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "API-Key": this.apiKey,
        "Content-Type": "application/json"
      },
      timeout: 20000 // Increased for reliable scraping
    });
  }

  /**
   * Check if the adapter is properly configured.
   */
  isConfigured() {
    return !!this.apiKey && this.apiKey !== "your_api_key";
  }

  /**
   * Search for products on Amazon.
   */
  async search(query, filters = {}) {
    try {
      console.log(`[AmazonOmkar] Searching for: "${query}"...`);
      const response = await this.client.get("/search", {
        params: {
          query,
          page: filters.page || 1,
          country_code: "US", // Default to US, could be dynamic later
          sort_by: this._mapSortBy(filters.sortBy)
        }
      });

      const items = response.data.results || [];
      console.log(`[AmazonOmkar] Found ${items.length} results for "${query}".`);
      
      return items.map(p => ({
        id: `amz-${p.asin}`,
        marketplace: "amazon",
        title: p.title ? p.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'") : "Amazon Product",
        price: parseFloat(p.price) || 0,
        currency: p.currency || "USD",
        rating: parseFloat(p.rating) || 0,
        reviewCount: parseInt(p.reviews) || 0,
        image: p.image_url,
        images: [p.image_url], // For early gallery support
        seller: "Amazon",
        shipping: p.is_prime ? "Free (Prime)" : (p.delivery_info?.split("Or")[0] || "Check Site"),
        deliveryDays: p.is_prime ? 2 : 5,
        inStock: true,
        url: p.link,
        category: filters.category || "electronics",
        brand: "",
        condition: "New",
        tags: [p.asin]
      }));
    } catch (err) {
      console.error(`[AmazonOmkar] Search failed:`, err.message);
      throw err;
    }
  }

  /**
   * Get product details by ID.
   */
  async getById(id) {
    const asin = id.replace("amz-", "");
    try {
      console.log(`[AmazonOmkar] Fetching details for: ${asin}...`);
      const response = await this.client.get("/product-details", {
        params: { asin, country_code: "US" }
      });

      const p = response.data;
      if (!p) return null;

      return {
        id: `amz-${p.asin}`,
        marketplace: "amazon",
        title: p.product_name,
        price: parseFloat(p.current_price) || 0,
        currency: p.currency || "USD",
        rating: parseFloat(p.rating) || 0,
        reviewCount: parseInt(p.reviews) || 0,
        image: p.main_image_url,
        images: p.additional_image_urls ? [p.main_image_url, ...p.additional_image_urls] : [p.main_image_url],
        seller: p.brand_info || "Amazon",
        shipping: p.is_prime ? "Free (Prime)" : "Check Site",
        deliveryDays: 3,
        inStock: p.availability === "In Stock",
        url: p.link,
        category: "electronics",
        brand: p.brand_info || "",
        condition: "New",
        tags: [p.asin],
        description: p.full_description || p.key_features?.join("\n") || ""
      };
    } catch (err) {
      console.error(`[AmazonOmkar] getById failed:`, err.message);
      return null;
    }
  }

  /**
   * Maps internal sort keys to Omkar Amazon API sort keys.
   */
  _mapSortBy(sortBy) {
    const mapping = {
      "price_asc":  "lowest_price",
      "price_desc": "highest_price",
      "rating":     "reviews",
      "popularity": "best_sellers"
    };
    return mapping[sortBy] || "relevance";
  }
}

module.exports = new AmazonAdapter();
