/**
 * Currency utility to handle conversion to Ghana Cedis (GHS).
 */

const EXCHANGE_RATE_USD_GHS = parseFloat(process.env.EXCHANGE_RATE_USD_GHS) || 14.50;

/**
 * Converts a price from a specific currency to GHS.
 * @param {number|string} price 
 * @param {string} fromCurrency 
 * @returns {number} Converted price
 */
function convertToGHS(price, fromCurrency = "USD") {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) return 0;
  if (!fromCurrency || fromCurrency === "GHS") return numericPrice;

  // Currently we only handle USD to GHS, but we can expand this.
  if (fromCurrency === "USD") {
    return Math.round((numericPrice * EXCHANGE_RATE_USD_GHS) * 100) / 100;
  }

  // If we don't know the currency, we assume it's USD for now 
  // since most marketplace APIs return USD by default.
  return Math.round((numericPrice * EXCHANGE_RATE_USD_GHS) * 100) / 100;
}

module.exports = {
  convertToGHS,
  EXCHANGE_RATE_USD_GHS
};
