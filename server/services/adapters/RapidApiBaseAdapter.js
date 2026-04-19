const axios = require("axios");
const BaseAdapter = require("./BaseAdapter");

/**
 * Base class for RapidAPI-based marketplace adapters.
 * Handles common functionality like headers, timeouts, and error normalized logging.
 */
class RapidApiBaseAdapter extends BaseAdapter {
  constructor(name, host) {
    super(name);
    this.host = host;
    
    // Create axios instance with RapidAPI defaults
    this.client = axios.create({
      baseURL: `https://${host}`,
      headers: {
        "Content-Type": "application/json"
      },
      timeout: 15000 // Increased to 15s for scraper reliability
    });
  }

  /**
   * Get the current API key from environment variables.
   */
  get apiKey() {
    return process.env.RAPIDAPI_KEY;
  }

  /**
   * Check if the adapter is properly configured.
   */
  isConfigured() {
    const key = this.apiKey;
    const isConfigured = !!(key && key !== "your_rapidapi_key" && this.host);
    
    if (!isConfigured) {
      // console.debug(`[RapidAPI] ${this.name} adapter is NOT active (missing or default key/host)`);
    }
    
    return isConfigured;
  }

  /**
   * Safely handle API requests with logging and error reporting.
   */
  async request(config) {
    try {
      if (!this.isConfigured()) {
        throw new Error(`Adapter ${this.name} is not configured`);
      }
      
      const fullUrl = `https://${this.host}${config.url}`;
      console.log(`[RapidAPI] Fetching: ${fullUrl} | Params:`, JSON.stringify(config.params));

      const response = await this.client({
        ...config,
        headers: {
          ...config.headers,
          "X-RapidAPI-Key": this.apiKey,
          "X-RapidAPI-Host": this.host
        }
      });
      
      console.log(`[RapidAPI] Raw Response (Partial):`, JSON.stringify(response.data).substring(0, 300));
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      const errorData = err.response?.data;
      const headers = err.response?.headers;
      
      console.error(`[RapidAPI] Error in ${this.name} (${status || "No Status"}):`);
      console.error(` > URL: https://${this.host}${config.url}`);
      console.error(` > Body:`, JSON.stringify(errorData || err.message));
      if (headers) {
        console.error(` > X-RapidAPI-Proxy-Response:`, headers['x-rapidapi-proxy-response']);
      }
      throw err;
    }
  }
}

module.exports = RapidApiBaseAdapter;
