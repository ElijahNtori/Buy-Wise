/**
 * GET /api/products/suggestions?q=...
 *
 * Returns an array of autocomplete suggestion strings derived from:
 *   1. Unique words/phrases extracted from mockProducts titles
 *   2. A curated list of trending search terms
 *
 * In production, replace / augment with an Elasticsearch prefix query or
 * similar search-index-backed suggestion engine.
 */

const { mockProducts } = require("../data/mockProducts");

// Build a word-level index from product titles on first call (lazy, cached)
let _titleIndex = null;

function getTitleIndex() {
  if (_titleIndex) return _titleIndex;

  const phrases = new Set();

  mockProducts.forEach(p => {
    if (!p.title) return;
    // Add full title (lowercased, trimmed)
    const clean = p.title.toLowerCase().trim();
    phrases.add(clean);

    // Add significant 1-3 word n-grams from the title
    const words = clean.split(/\s+/).filter(w => w.length > 2);
    for (let i = 0; i < words.length; i++) {
      phrases.add(words[i]);
      if (words[i + 1]) phrases.add(`${words[i]} ${words[i + 1]}`);
      if (words[i + 1] && words[i + 2]) phrases.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
    }
  });

  _titleIndex = [...phrases].sort();
  return _titleIndex;
}

const TRENDING = [
  "headphones", "laptop", "shoes", "smart watch", "air fryer",
  "power bank", "iphone", "gaming chair", "wireless earbuds",
  "standing desk", "mechanical keyboard", "monitor", "webcam",
  "blender", "vacuum cleaner", "tv", "tablet", "camera"
];

exports.getSuggestions = (req, res) => {
  try {
    const q = (req.query.q || "").toLowerCase().trim();

    if (q.length < 2) {
      // Return trending when query is too short
      return res.json({ success: true, suggestions: TRENDING.slice(0, 8) });
    }

    const index = getTitleIndex();

    // Prefix-match first, then substring-match — deduplicated, capped at 8
    const prefixMatches    = index.filter(s => s.startsWith(q));
    const substringMatches = index.filter(s => !s.startsWith(q) && s.includes(q));
    const combined = [...prefixMatches, ...substringMatches].slice(0, 8);

    // Fall back to trending if nothing matches
    const suggestions = combined.length > 0
      ? combined
      : TRENDING.filter(t => t.includes(q)).slice(0, 8);

    res.json({ success: true, suggestions });
  } catch (err) {
    console.error("getSuggestions error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch suggestions" });
  }
};
