const crypto = require("crypto");
const axios = require("axios");
const BaseAdapter = require("./BaseAdapter");

/**
 * eBay adapter using SerpApi (serpapi.com).
 *
 * FIX: _mapToProduct previously used Math.random() as a fallback ID when
 * item.product_id was absent. This caused the same product to get a different
 * ID on every search, breaking compare-list deduplication. The fallback now
 * produces a stable hash derived from the product title and price.
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

    // FIX: replaced Math.random() fallback with a stable hash so the same
    // product always gets the same ID across multiple searches.
    const stableId = item.product_id || this._stableId(item.title, price);

    return {
      id: `ebay-${stableId}`,
      marketplace: "ebay",
      title: item.title,
      subtitle: item.subtitle || "",
      price,
      currency: "USD",
      rating: this._parseNumber(item.rating) || 4.5,
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
   * Produces a short, stable identifier from title + price so that the same
   * product listing always maps to the same ID even across separate searches.
   */
  _stableId(title = "", price = 0) {
    return crypto
      .createHash("md5")
      .update(`${title}::${price}`)
      .digest("hex")
      .slice(0, 9);
  }

  _parsePrice(priceData) {
    return this._parseNumber(priceData);
  }

  _parseNumber(val) {
    if (val === undefined || val === null) return 0;
    if (typeof val === "number") return val;
    if (typeof val === "object") {
      if (val.extracted !== undefined) return val.extracted;
      if (val.amount !== undefined)    return val.amount;
      if (val.raw)                     return this._parseNumber(val.raw);
    }
    if (typeof val === "string") {
      return parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
    }
    return 0;
  }
}

module.exports = new SerpApiEbayAdapter();
