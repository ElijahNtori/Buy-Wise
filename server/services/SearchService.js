const mockAdapter = require("./adapters/MockAdapter");
const amazonAdapter = require("./adapters/AmazonRapidApiAdapter");
const ebayAdapter = require("./adapters/SerpApiEbayAdapter");
const aliexpressAdapter = require("./adapters/AliExpressAdapter");
const alibabaAdapter = require("./adapters/AlibabaAdapter");
const { convertToGHS } = require("../utils/currencyUtils");

/**
 * SearchService orchestrates requests across multiple marketplace adapters.
 */
class SearchService {
  constructor() {
    this.realAdapters = {
      amazon: amazonAdapter,
      ebay: ebayAdapter,
      aliexpress: aliexpressAdapter,
      alibaba: alibabaAdapter
    };
    this.mockAdapter = mockAdapter;
  }

  /**
   * Search across all active adapters and aggregate results.
   */
  async search(query, filters) {
    let marketplacesToSearch = ["amazon", "ebay", "aliexpress", "alibaba"];
    
    if (filters.marketplace && filters.marketplace !== "all") {
      marketplacesToSearch = [filters.marketplace];
    }

    const searchPromises = marketplacesToSearch.map(m => this._searchMarketplace(m, query, filters));
    
    try {
      const resultsArray = await Promise.all(searchPromises);
      const allResults = resultsArray.flat();
      return this._convertResults(allResults);
    } catch (err) {
      console.error("SearchService Error:", err);
      throw err;
    }
  }

  /**
   * Internal helper to search a specific marketplace with fallback.
   */
  async _searchMarketplace(marketplace, query, filters) {
    const adapter = this.realAdapters[marketplace];
    
    // 1. Try real adapter if it exists and is configured
    if (adapter && adapter.isConfigured()) {
      try {
        console.log(`[SearchService] Fetching real data for ${marketplace}...`);
        return await adapter.search(query, filters);
      } catch (err) {
        console.warn(`[SearchService] Real ${marketplace} adapter failed:`, err.message);
        if (err.response) {
          console.warn(`[SearchService] ${marketplace} API Status: ${err.response.status}`);
          console.warn(`[SearchService] ${marketplace} API Body:`, JSON.stringify(err.response.data).substring(0, 500));
        }
        console.warn(`[SearchService] Falling back to mock for ${marketplace}...`);
      }
    }

    // 2. Fallback to mock adapter
    // We pass the marketplace filter to the mock adapter to ensure it only returns products for that marketplace
    return this.mockAdapter.search(query, { ...filters, marketplace });
  }

  /**
   * Get a product by ID by checking all adapters.
   */
  async getProductById(id) {
    // Try real adapters first
    for (const adapter of Object.values(this.realAdapters)) {
      if (adapter.isConfigured()) {
        const product = await adapter.getById(id);
        if (product) return this._convertResults(product);
      }
    }
    
    // Fallback to mock
    const mockProduct = await this.mockAdapter.getById(id);
    return this._convertResults(mockProduct);
  }

  /**
   * Helper to convert all prices to GHS centrally.
   */
  _convertResults(data) {
    if (!data) return data;
    
    if (Array.isArray(data)) {
      return data.map(p => this._convertSingleProduct(p));
    }
    
    return this._convertSingleProduct(data);
  }

  _convertSingleProduct(p) {
    if (!p) return p;
    
    return {
      ...p,
      price: convertToGHS(p.price, p.currency),
      currency: "GHS"
    };
  }

  /**
   * Get multiple products by IDs (aggregating across adapters).
   */
  async getProductsByIds(ids) {
    const productPromises = ids.map(id => this.getProductById(id));
    const results = await Promise.all(productPromises);
    return results.filter(Boolean);
  }
}

module.exports = new SearchService();
