/**
 * Base class for all marketplace adapters.
 *
 * FIX: isConfigured() was not defined here even though SearchService calls it
 * on every adapter. Any new adapter that forgets to implement it would throw
 * "TypeError: adapter.isConfigured is not a function" at runtime. Added a
 * default that throws a clear error so omissions are caught immediately.
 */
class BaseAdapter {
  constructor(name) {
    this.name = name;
  }

  /**
   * Returns true if the adapter has the required credentials to make real API
   * calls. Must be overridden in every subclass.
   * @returns {boolean}
   */
  isConfigured() {
    throw new Error(`isConfigured() must be implemented for the "${this.name}" adapter`);
  }

  /**
   * Search for products.
   * @param {string} query
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async search(query, filters) {
    throw new Error(`search() must be implemented for the "${this.name}" adapter`);
  }

  /**
   * Get a single product by its provider-specific ID.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    throw new Error(`getById() must be implemented for the "${this.name}" adapter`);
  }
}

module.exports = BaseAdapter;
