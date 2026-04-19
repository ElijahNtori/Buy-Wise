/**
 * Base class for all marketplace adapters.
 * Every adapter must implement at least 'search' and 'getById'.
 */
class BaseAdapter {
  constructor(name) {
    this.name = name;
  }

  /**
   * Search for products.
   * @param {string} query 
   * @param {Object} filters 
   * @returns {Promise<Array>}
   */
  async search(query, filters) {
    throw new Error(`Method 'search' must be implemented for ${this.name} adapter`);
  }

  /**
   * Get a single product by its provider-specific ID.
   * @param {string} id 
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    throw new Error(`Method 'getById' must be implemented for ${this.name} adapter`);
  }
}

module.exports = BaseAdapter;
