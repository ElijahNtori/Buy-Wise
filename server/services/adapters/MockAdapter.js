const BaseAdapter = require("./BaseAdapter");
const { searchProducts, getProductById } = require("../../data/mockProducts");

/**
 * MockAdapter serves as the default data provider during development.
 * It uses the local JSON/JS data in server/data/mockProducts.js.
 */
class MockAdapter extends BaseAdapter {
  constructor() {
    super("mock");
  }

  async search(query, filters) {
    // Artificial delay to simulate real API network latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return searchProducts(query, filters);
  }

  async getById(id) {
    return getProductById(id);
  }
}

module.exports = new MockAdapter();
