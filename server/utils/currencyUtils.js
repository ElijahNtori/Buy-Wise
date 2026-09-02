const exchangeRateService = require("../services/ExchangeRateService");

async function getRateToGHS(fromCurrency = "USD") {
  return exchangeRateService.getRateToGHS(fromCurrency);
}

async function convertToGHS(price, fromCurrency = "USD") {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  if (Number.isNaN(numericPrice)) return 0;

  const rate = await getRateToGHS(fromCurrency);
  return Math.round(numericPrice * rate * 100) / 100;
}

module.exports = {
  convertToGHS,
  getRateToGHS,
  getExchangeRateSnapshot: () => exchangeRateService.getSnapshot()
};
