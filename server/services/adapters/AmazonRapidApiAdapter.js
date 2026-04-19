const RapidApiBaseAdapter = require("./RapidApiBaseAdapter");

/**
 * Amazon adapter using OpenWeb Ninja "Real-Time Amazon Data" or similar RapidAPI.
 */
class AmazonRapidApiAdapter extends RapidApiBaseAdapter {
  constructor() {
    // Default host for OpenWeb Ninja Amazon Data API
    const host = process.env.RAPIDAPI_AMAZON_HOST || "real-time-amazon-data.p.rapidapi.com";
    super("amazon", host);
  }

  /**
   * Search for products on Amazon.
   * Maps RapidAPI response to BuyWise format.
   */
  async search(query, filters = {}) {
    try {
      const response = await this.request({
        method: "GET",
        url: "/search",
        params: {
          query,
          page: "1",
          country: "US",
          sort_by: this._mapSortBy(filters.sortBy),
          min_price: filters.minPrice,
          max_price: filters.maxPrice
        }
      });

      // Based on OpenWeb Ninja structure: response.data.products
      const products = response.data?.products || [];
      
      return products.map(p => ({
        id: `amz-${p.asin}`,
        marketplace: "amazon",
        title: p.product_title,
        price: parseFloat(p.product_price?.replace(/[^0-9.]/g, "")) || 0,
        currency: p.currency || "USD",
        rating: parseFloat(p.product_star_rating) || 0,
        reviewCount: parseInt(p.product_num_ratings) || 0,
        image: p.product_photo,
        seller: "Amazon",
        shipping: p.is_prime ? "Free (Prime)" : "Check Site",
        deliveryDays: p.delivery_days || 3,
        inStock: true,
        url: p.product_url,
        category: filters.category || "electronics",
        brand: "",
        condition: "New",
        tags: [p.asin]
      }));
    } catch (err) {
      // Re-throw to let SearchService handle fallback
      throw err;
    }
  }

  async getById(id) {
    const asin = id.replace("amz-", "");
    try {
      const response = await this.request({
        method: "GET",
        url: "/product-details",
        params: { asin, country: "US" }
      });
      
      const p = response.data;
      if (!p) return null;

      return {
        id: `amz-${p.asin}`,
        marketplace: "amazon",
        title: p.product_title,
        price: parseFloat(p.product_price?.replace(/[^0-9.]/g, "")) || 0,
        currency: p.currency || "USD",
        rating: parseFloat(p.product_star_rating) || 0,
        reviewCount: parseInt(p.product_num_ratings) || 0,
        image: p.product_photo,
        seller: "Amazon",
        shipping: p.is_prime ? "Free (Prime)" : "Check Site",
        deliveryDays: 3,
        inStock: true,
        url: p.product_url,
        category: "electronics",
        brand: p.product_brand || "",
        condition: "New",
        tags: [p.asin]
      };
    } catch (err) {
      return null;
    }
  }

  _mapSortBy(sortBy) {
    const mapping = {
      "price_asc": "PRICE_LOW_TO_HIGH",
      "price_desc": "PRICE_HIGH_TO_LOW",
      "rating": "REVIEWS_HIGHEST_RATED",
      "popularity": "BEST_SELLERS"
    };
    return mapping[sortBy] || "RELEVANCE";
  }
}

module.exports = new AmazonRapidApiAdapter();
