const RapidApiBaseAdapter = require("./RapidApiBaseAdapter");

/**
 * eBay adapter using "Ebay Search Result" RapidAPI (ebay-search-result.p.rapidapi.com).
 */
class EbayRapidApiAdapter extends RapidApiBaseAdapter {
  constructor() {
    const host = process.env.RAPIDAPI_EBAY_HOST || "ebay-search-result.p.rapidapi.com";
    super("ebay", host);
  }

  async search(query, filters = {}) {
    try {
      console.log(`[EbayRapidApi] Searching via new host: ${this.host}`);
      const response = await this.request({
        method: "GET",
        url: `/search/${encodeURIComponent(query)}`,
      });

      // Handle the results array. The provider likely returns it as 'results' or 'data'
      const items = response.results || response.data || response.items || [];
      
      console.log(`[EbayRapidApi] Found ${items.length} raw items.`);

      return items.map(item => {
        // Robust field mapping for unknown response structure
        const title = item.title || item.name || item.product_name || "eBay Product";
        const price = this._parsePrice(item.price || item.current_price || item.amount);
        const image = item.image || item.thumbnail || item.picture || item.thumbnail_url || "";
        const url = item.url || item.item_url || item.link || "";
        const id = item.id || item.itemId || item.asin || Math.random().toString(36).substr(2, 9);

        return {
          id: `ebay-${id}`,
          marketplace: "ebay",
          title: title,
          price: price,
          currency: "USD",
          rating: item.rating || 4.5, 
          reviewCount: item.reviews_count || 100,
          image: image,
          seller: item.seller_name || item.seller || "eBay Seller",
          shipping: item.shipping || item.shipping_info || "Check Site",
          deliveryDays: 5,
          inStock: true,
          url: url,
          category: filters.category || "electronics",
          brand: item.brand || "",
          condition: item.condition || "New",
          tags: ["ebay"]
        };
      });
    } catch (err) {
      console.error(`[EbayRapidApi] Search failed:`, err.message);
      // Let SearchService handle the fallback to mock data
      throw err;
    }
  }

  async getById(id) {
    const itemId = id.replace("ebay-", "");
    try {
      // Trying standard product details endpoint, might need adjustment
      const response = await this.request({
        method: "GET",
        url: `/product/${itemId}`
      });
      
      const item = response.data || response.item || response;
      if (!item) return null;

      return {
        id: `ebay-${itemId}`,
        marketplace: "ebay",
        title: item.title || item.name,
        price: this._parsePrice(item.price),
        currency: "USD",
        image: item.image || item.thumbnail,
        url: item.url || item.link,
        tags: ["ebay"]
      };
    } catch (err) {
      return null;
    }
  }

  _parsePrice(price) {
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
    }
    if (price && typeof price === "object") {
       return parseFloat(price.value || price.amount || 0);
    }
    return 0;
  }
}

module.exports = new EbayRapidApiAdapter();
