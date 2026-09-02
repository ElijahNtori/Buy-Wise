/**
 * Deterministic mock review generator.
 *
 * Produces consistent reviews for a given product ID using a simple
 * seeded pseudo-random approach so the same product always shows the
 * same reviews across renders and page refreshes.
 *
 * In production: replace with calls to marketplace review APIs.
 */

const USERNAMES = [
  "kwame_agyei", "ama.asante", "kofi.frimpong", "adjoa_mensah",
  "yaw_owusu", "abena.darko", "kweku_boateng", "akosua_ofori",
  "nana.boadu", "efua_appiah", "kojo.antwi", "adwoa_asante",
  "bright_ofori", "mawuli.dzah", "serwaa_k", "ben_quaye"
];

const REVIEW_TEXTS = {
  5: [
    "Exactly as described. Arrived earlier than expected and packaging was great. Very happy with this purchase.",
    "Outstanding quality for the price. Already recommended it to two friends. Will definitely buy again.",
    "Exceeded my expectations completely. The build quality is premium and works perfectly out of the box.",
    "Best price I found after checking multiple sites. Fast shipping too. 10/10 would buy again.",
    "Brilliant product. Solid quality, easy setup, and the seller was responsive when I had questions."
  ],
  4: [
    "Good product overall. Minor packaging dent on arrival but the item itself is perfect. Solid buy.",
    "Works as advertised. Delivery took a day longer than estimated but the item quality makes up for it.",
    "Really happy with this. The only reason I'm not giving 5 stars is the manual could be clearer.",
    "Great value. Performs well, feels sturdy. Took off one star because a small accessory was missing.",
    "Decent quality and fair price. Does exactly what it says. Wouldn't hesitate to recommend."
  ],
  3: [
    "It's okay. Does the job but feels a bit cheap compared to photos. Probably fine for casual use.",
    "Average experience. Works but feels slightly different from what was shown in the images.",
    "Mixed feelings. The product itself is fine but customer support was slow to respond to my query.",
    "Functional but nothing special. Delivery was fast though, so giving it a middle rating.",
    "Not bad for the price. Just don't expect premium quality. Good enough for everyday tasks."
  ]
};

/**
 * Seeded PRNG — simple LCG so results are reproducible per product ID.
 */
function createRng(seed) {
  let s = [...seed].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0x7fffffff, 0) || 12345;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function randomDate(rng) {
  const now = Date.now();
  const sixMonthsMs = 180 * 24 * 60 * 60 * 1000;
  const ts = now - Math.floor(rng() * sixMonthsMs);
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Generate `count` deterministic reviews for a product.
 * @param {string} productId
 * @param {number} productRating - numeric rating 0-5 (shapes distribution)
 * @param {number} count - number of reviews to generate (default 3)
 * @returns {Array<{username, rating, date, text, helpful}>}
 */
export function generateReviews(productId, productRating = 4.2, count = 3) {
  const rng = createRng(productId || "default");
  const baseRating = Math.min(5, Math.max(1, Math.round(productRating)));

  return Array.from({ length: count }, (_, i) => {
    // Vary ratings slightly around the product average
    const offset = Math.floor(rng() * 3) - 1; // -1, 0, or +1
    const rating = Math.min(5, Math.max(3, baseRating + offset));
    const textPool = REVIEW_TEXTS[rating] || REVIEW_TEXTS[4];

    return {
      id: `rev-${productId}-${i}`,
      username: pick(USERNAMES, rng),
      rating,
      date: randomDate(rng),
      text: pick(textPool, rng),
      helpful: Math.floor(rng() * 40)
    };
  });
}
