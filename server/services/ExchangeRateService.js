const fs = require("fs/promises");
const path = require("path");
const axios = require("axios");

const STORE_PATH = path.join(__dirname, "..", "data", "exchangeRates.json");
const FIXER_ENDPOINT = "https://data.fixer.io/api/latest";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const FALLBACK_RATES = {
  base: "EUR",
  rates: {
    EUR: 1,
    USD: 1.08,
    GBP: 0.86,
    GHS: parseFloat(process.env.EXCHANGE_RATE_USD_GHS || "14.50") * 1.08,
    CNY: 7.82,
    JPY: 166.5,
    CAD: 1.47,
    AUD: 1.65
  },
  source: "fallback"
};

class ExchangeRateService {
  constructor() {
    this.snapshot = null;
    this.refreshTimer = null;
  }

  async init() {
    await this.loadPersistedSnapshot();
    if (!this.snapshot || this.isStale(this.snapshot.fetchedAt)) {
      await this.refresh();
    }

    if (!this.refreshTimer) {
      this.refreshTimer = setInterval(() => {
        this.refresh().catch(err => {
          console.warn("[ExchangeRateService] Scheduled refresh failed:", err.message);
        });
      }, ONE_DAY_MS);
      this.refreshTimer.unref?.();
    }
  }

  async loadPersistedSnapshot() {
    try {
      const raw = await fs.readFile(STORE_PATH, "utf8");
      this.snapshot = JSON.parse(raw);
    } catch {
      this.snapshot = null;
    }
  }

  isStale(fetchedAt) {
    if (!fetchedAt) return true;
    return Date.now() - new Date(fetchedAt).getTime() >= ONE_DAY_MS;
  }

  async refresh() {
    const accessKey = process.env.FIXER_API_KEY;

    if (!accessKey || accessKey === "your_fixer_api_key") {
      console.warn("[ExchangeRateService] FIXER_API_KEY is not configured. Using fallback rates.");
      this.snapshot = this.snapshot || this.buildSnapshot(FALLBACK_RATES);
      return this.snapshot;
    }

    try {
      const response = await axios.get(FIXER_ENDPOINT, {
        params: { access_key: accessKey, symbols: "USD,GHS,EUR,GBP,CNY,JPY,CAD,AUD" },
        timeout: 8000
      });

      if (!response.data?.success || !response.data?.rates?.GHS) {
        throw new Error(response.data?.error?.info || "Fixer response did not include GHS rates");
      }

      this.snapshot = this.buildSnapshot({
        base: response.data.base || "EUR",
        rates: response.data.rates,
        source: "fixer",
        timestamp: response.data.timestamp
      });

      await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
      await fs.writeFile(STORE_PATH, JSON.stringify(this.snapshot, null, 2));
      return this.snapshot;
    } catch (err) {
      console.warn("[ExchangeRateService] Live fetch failed. Using cached/fallback rates:", err.message);
      this.snapshot = this.snapshot || this.buildSnapshot(FALLBACK_RATES);
      return this.snapshot;
    }
  }

  buildSnapshot({ base, rates, source, timestamp }) {
    return {
      base,
      rates,
      source,
      timestamp: timestamp || null,
      fetchedAt: new Date().toISOString()
    };
  }

  getSnapshot() {
    return this.snapshot || this.buildSnapshot(FALLBACK_RATES);
  }

  getRateToGHS(fromCurrency = "USD") {
    const snapshot = this.getSnapshot();
    const currency = String(fromCurrency || "USD").toUpperCase();
    if (currency === "GHS") return 1;

    const fromRate = Number(snapshot.rates[currency]);
    const ghsRate = Number(snapshot.rates.GHS);
    if (!fromRate || !ghsRate) {
      const usdFallback = parseFloat(process.env.EXCHANGE_RATE_USD_GHS || "14.50");
      return currency === "USD" ? usdFallback : usdFallback;
    }

    return ghsRate / fromRate;
  }

  getUsdToGhs() {
    return this.getRateToGHS("USD");
  }
}

module.exports = new ExchangeRateService();
