const axios = require("axios");
const BaseAdapter = require("./BaseAdapter");

/**
 * eBay adapter using SerpApi (serpapi.com).
 * This engine provides high-quality eBay organic results.
 */
class SerpApiEbayAdapter extends BaseAdapter {
  constructor() {
    super("ebay");
    this.baseUrl = "https://serpapi.com/search";
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 15000
    });
  }

  get apiKey() {
    return process.env.SERPAPI_KEY;
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async search(query, filters = {}) {
    try {
      console.log(`[SerpApiEbay] Searching for: "${query}"`);
      
      const response = await this.client.get("", {
        params: {
          engine: "ebay",
          _nkw: query,
          ebay_domain: "ebay.com",
          api_key: this.apiKey
        }
      });

      const items = response.data.organic_results || [];
      console.log(`[SerpApiEbay] Found ${items.length} organic results.`);

      return items.map(item => this._mapToProduct(item, filters));
    } catch (err) {
      console.error(`[SerpApiEbay] Search failed:`, err.message);
      if (err.response) {
        console.error(`[SerpApiEbay] Response:`, JSON.stringify(err.response.data));
      }
      throw err;
    }
  }

  async getById(id) {
    // SerpApi uses engine "ebay_product" for detailed product info
    // But usually our IDs are product_ids or similar.
    const productId = id.replace("ebay-", "");
    try {
      console.log(`[SerpApiEbay] Fetching product details for ID: ${productId}`);
      const response = await this.client.get("", {
        params: {
          engine: "ebay_product",
          product_id: productId,
          ebay_domain: "ebay.com",
          api_key: this.apiKey
        }
      });

      const product = response.data.product_results || response.data;
      if (!product) return null;

      // Map single product result using ebay_product engine structure
      return {
        id: `ebay-${productId}`,
        marketplace: "ebay",
        title: product.title,
        price: this._parseNumber(product.buy?.buy_it_now?.price?.amount || product.price),
        currency: product.buy?.buy_it_now?.price?.currency || "USD",
        image: product.thumbnail || (product.images && product.images[0]),
        url: product.link,
        rating: this._parseNumber(product.rating || product.reviews_stats?.rating) || 0,
        reviewCount: this._parseNumber(product.reviews || product.reviews_stats?.reviews) || 0,
        seller: product.seller?.username || "eBay Seller",
        condition: product.condition || "New",
        tags: ["ebay"]
      };
    } catch (err) {
      console.error(`[SerpApiEbay] getById failed:`, err.message);
      return null;
    }
  }

  _mapToProduct(item, filters) {
    const price = this._parsePrice(item.price);

    return {
      id: `ebay-${item.product_id || Math.random().toString(36).substr(2, 9)}`,
      marketplace: "ebay",
      title: item.title,
      subtitle: item.subtitle || "",
      price: price,
      currency: "USD",
      rating: this._parseNumber(item.rating) || 4.5, // Defaulting if not present
      reviewCount: this._parseNumber(item.reviews) || 0,
      image: item.thumbnail || "",
      url: item.link,
      seller: item.seller?.username || "eBay Seller",
      shipping: item.shipping || "Check Site",
      deliveryDays: 5,
      inStock: true,
      category: filters.category || "General",
      condition: item.condition || "New",
      tags: ["ebay", "serpapi"]
    };
  }

  /**
   * Robust price parser for SerpApi's multiple price formats.
   * Handles: 
   * - { extracted: 10.5 }
   * - { from: { extracted: 10.5 } }
   * - "$10.50" (string)
   * - 10.5 (number)
   */
  _parsePrice(priceData) {
    return this._parseNumber(priceData);
  }

  /**
   * General numeric parser for SerpApi's complex field formats.
   */
  _parseNumber(val) {
    if (val === undefined || val === null) return 0;
    if (typeof val === "number") return val;
    if (typeof val === "object") {
      if (val.extracted !== undefined) return val.extracted;
      if (val.amount !== undefined) return val.amount;
      if (val.raw) return this._parseNumber(val.raw);
    }
    if (typeof val === "string") {
      return parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
    }
    return 0;
  }
}

module.exports = new SerpApiEbayAdapter();
