const axios = require("axios");
const BaseAdapter = require("./BaseAdapter");

/**
 * Alibaba adapter using Omkar Cloud Scraper API.
 */
class AlibabaAdapter extends BaseAdapter {
  constructor() {
    super("alibaba");
    this.apiKey = process.env.OMKAR_ALIBABA_KEY;
    this.baseUrl = "https://alibaba-scraper.omkar.cloud/alibaba";
    
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
   * Search for products on Alibaba.
   */
  async search(query, filters = {}) {
    try {
      console.log(`[AlibabaOmkar] Searching for: "${query}"...`);
      const response = await this.client.get("/products/search", {
        params: {
          search_query: query,
          page: filters.page || 1
        }
      });

      const items = response.data.products || [];
      
      return items.map(p => {
        // Extract a numeric price from the pricing structure
        // Pricing can be a range like "2.5-2.7" or tiers.
        // We take the first tier unit price if available, otherwise parse the range.
        let price = 0;
        if (p.pricing?.tiers?.length > 0) {
          price = parseFloat(p.pricing.tiers[0].unit_price);
        } else if (p.pricing?.range) {
          price = parseFloat(p.pricing.range.split("-")[0]);
        }

        return {
          id: `alibaba-${p.product_id}`,
          marketplace: "alibaba",
          title: p.title,
          price: price || 0,
          currency: "USD",
          rating: parseFloat(p.seller?.ratings?.find(r => r.label === "Product as Described")?.score) || 0,
          reviewCount: 0, // Alibaba doesn't always show total review count in search
          image: p.thumbnail?.startsWith("//") ? `https:${p.thumbnail}` : p.thumbnail,
          images: [p.thumbnail?.startsWith("//") ? `https:${p.thumbnail}` : p.thumbnail],
          seller: p.supplier?.name || "Alibaba Supplier",
          shipping: "Check Site",
          deliveryDays: 30, // Default for international shipping
          inStock: true,
          url: p.url?.startsWith("//") ? `https:${p.url}` : p.url,
          category: filters.category || "wholesale",
          brand: "",
          condition: "New",
          tags: ["alibaba", "wholesale"],
          moq: p.pricing?.minimum_order_label || "Contact Supplier"
        };
      });
    } catch (err) {
      console.error("[AlibabaOmkar] Search failed:", err.message);
      throw err;
    }
  }

  /**
   * Get product details by ID.
   */
  async getById(id) {
    const productId = id.replace("alibaba-", "");
    try {
      console.log(`[AlibabaOmkar] Fetching details for: ${productId}...`);
      const response = await this.client.get("/products/details", {
        params: {
          product_id: productId
        }
      });

      const p = response.data;
      if (!p) return null;

      let price = 0;
      if (p.pricing?.tiers?.length > 0) {
        price = parseFloat(p.pricing.tiers[0].unit_price);
      }

      return {
        id: `alibaba-${p.product_id}`,
        marketplace: "alibaba",
        title: p.title,
        price: price || 0,
        currency: "USD",
        rating: 0, // Detail response doesn't always have simple score
        reviewCount: 0,
        image: p.gallery_images?.[0]?.startsWith("//") ? `https:${p.gallery_images[0]}` : p.gallery_images?.[0],
        seller: p.supplier?.name || "Alibaba Supplier",
        shipping: "Check Site",
        deliveryDays: 30,
        inStock: true,
        url: p.url?.startsWith("//") ? `https:${p.url}` : p.url,
        category: "wholesale",
        brand: "",
        condition: "New",
        tags: ["alibaba", "wholesale"],
        description: p.specifications?.summary || "",
        images: (p.gallery_images || []).map(img => img.startsWith("//") ? `https:${img}` : img),
        moq: p.pricing?.minimum_order_label || "Contact Supplier"
      };
    } catch (err) {
      console.error("[AlibabaOmkar] getById failed:", err.message);
      return null;
    }
  }
}

module.exports = new AlibabaAdapter();
