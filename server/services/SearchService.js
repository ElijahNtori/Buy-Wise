const mockAdapter      = require("./adapters/MockAdapter");
const amazonAdapter    = require("./adapters/AmazonAdapter");
const ebayAdapter      = require("./adapters/SerpApiEbayAdapter");
const aliexpressAdapter = require("./adapters/AliExpressAdapter");
const alibabaAdapter   = require("./adapters/AlibabaAdapter");
const { convertToGHS } = require("../utils/currencyUtils");

class SearchService {
  constructor() {
    this.realAdapters = {
      amazon:     amazonAdapter,
      ebay:       ebayAdapter,
      aliexpress: aliexpressAdapter,
      alibaba:    alibabaAdapter
    };
    this.mockAdapter = mockAdapter;
  }

  async search(query, filters) {
    let marketplacesToSearch = ["amazon", "ebay", "aliexpress", "alibaba"];

    if (filters.marketplace && filters.marketplace !== "all") {
      marketplacesToSearch = [filters.marketplace];
    }

    const searchPromises = marketplacesToSearch.map(m =>
      this._searchMarketplace(m, query, filters)
    );

    try {
      const resultsArray = await Promise.all(searchPromises);
      let allResults = resultsArray.flat();

      allResults = await this._convertResults(allResults);

      const minPrice  = parseFloat(filters.minPrice);
      const maxPrice  = parseFloat(filters.maxPrice);
      const minRating = parseFloat(filters.minRating);

      allResults = allResults.filter(p => {
        if (!isNaN(minPrice)  && p.price  < minPrice)  return false;
        if (!isNaN(maxPrice)  && p.price  > maxPrice)  return false;
        if (!isNaN(minRating) && p.rating < minRating) return false;
        if (filters.category && filters.category !== "all" && p.category !== filters.category) return false;
        return true;
      });

      switch (filters.sortBy) {
        case "price_asc":  allResults.sort((a, b) => a.price       - b.price);       break;
        case "price_desc": allResults.sort((a, b) => b.price       - a.price);       break;
        case "rating":     allResults.sort((a, b) => b.rating      - a.rating);      break;
        case "popularity": allResults.sort((a, b) => b.reviewCount - a.reviewCount); break;
        default: break;
      }

      return allResults;
    } catch (err) {
      console.error("SearchService Error:", err);
      throw err;
    }
  }

  async _searchMarketplace(marketplace, query, filters) {
    const adapter = this.realAdapters[marketplace];

    if (adapter && adapter.isConfigured()) {
      try {
        console.log(`[SearchService] ${marketplace} IS configured. Fetching real data...`);
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

    return this.mockAdapter.search(query, { ...filters, marketplace });
  }

  /**
   * FIX: The original loop had no try/catch per adapter. A network error from
   * the first configured adapter would propagate up and skip all subsequent
   * adapters (including mock fallback). Each adapter call is now wrapped
   * individually so failures are isolated and iteration continues.
   */
  async getProductById(id) {
    for (const adapter of Object.values(this.realAdapters)) {
      if (adapter.isConfigured()) {
        try {
          const product = await adapter.getById(id);
          if (product) return await this._convertResults(product);
        } catch (err) {
          console.warn(`[SearchService] getById failed on ${adapter.name}:`, err.message);
          // Continue to next adapter
        }
      }
    }

    // Fallback to mock
    const mockProduct = await this.mockAdapter.getById(id);
    return await this._convertResults(mockProduct);
  }

  async _convertResults(data) {
    if (!data) return data;
    if (Array.isArray(data)) {
      return await Promise.all(data.map(p => this._convertSingleProduct(p)));
    }
    return await this._convertSingleProduct(data);
  }

  async _convertSingleProduct(p) {
    if (!p) return p;
    const convertedPrice = await convertToGHS(p.price, p.currency);
    return {
      ...p,
      price: convertedPrice,
      currency: "GHS"
    };
  }

  async getProductsByIds(ids) {
    const productPromises = ids.map(id => this.getProductById(id));
    const results = await Promise.all(productPromises);
    return results.filter(Boolean);
  }
}

module.exports = new SearchService();
