/**
 * Mock product data simulating responses from multiple marketplaces.
 * In production, replace each marketplace's data fetch with real API calls.
 */

const mockProducts = [
  // ─── AMAZON ──────────────────────────────────────────────────────────────
  {
    id: "amz-001",
    marketplace: "amazon",
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    price: 279.99,
    currency: "USD",
    rating: 4.7,
    reviewCount: 12453,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop"
    ],
    seller: "Amazon.com",
    shipping: "Free",
    deliveryDays: 2,
    inStock: true,
    url: "https://www.amazon.com/dp/B09XS7JWHH",
    category: "electronics",
    brand: "Sony",
    condition: "New",
    tags: ["headphones", "wireless", "noise canceling", "sony", "audio"]
  },
  {
    id: "amz-002",
    marketplace: "amazon",
    title: "Apple AirPods Pro (2nd Generation) Wireless Earbuds",
    price: 189.99,
    currency: "USD",
    rating: 4.8,
    reviewCount: 28910,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop",
    seller: "Apple",
    shipping: "Free",
    deliveryDays: 1,
    inStock: true,
    url: "https://www.amazon.com/dp/B0BDHWDR12",
    category: "electronics",
    brand: "Apple",
    condition: "New",
    tags: ["earbuds", "wireless", "apple", "airpods", "noise canceling"]
  },
  {
    id: "amz-003",
    marketplace: "amazon",
    title: "Samsung 65-Inch QLED 4K Smart TV",
    price: 897.99,
    currency: "USD",
    rating: 4.5,
    reviewCount: 5621,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&h=400&fit=crop",
    seller: "Samsung Official",
    shipping: "Free",
    deliveryDays: 5,
    inStock: true,
    url: "https://www.amazon.com/dp/B0B5RJ6Q4B",
    category: "electronics",
    brand: "Samsung",
    condition: "New",
    tags: ["tv", "samsung", "4k", "smart tv", "qled", "television"]
  },
  {
    id: "amz-004",
    marketplace: "amazon",
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 Quart",
    price: 79.99,
    currency: "USD",
    rating: 4.7,
    reviewCount: 89543,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    seller: "Instant Pot",
    shipping: "Free",
    deliveryDays: 2,
    inStock: true,
    url: "https://www.amazon.com/dp/B00FLYWNYQ",
    category: "home",
    brand: "Instant Pot",
    condition: "New",
    tags: ["pressure cooker", "instant pot", "kitchen", "cooking", "appliance"]
  },
  {
    id: "amz-005",
    marketplace: "amazon",
    title: "Nike Air Max 270 Men's Running Shoes",
    price: 129.99,
    currency: "USD",
    rating: 4.4,
    reviewCount: 15678,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    seller: "Nike",
    shipping: "Free",
    deliveryDays: 3,
    inStock: true,
    url: "https://www.amazon.com/dp/B07DMMZXJZ",
    category: "fashion",
    brand: "Nike",
    condition: "New",
    tags: ["nike", "shoes", "running", "sneakers", "air max", "men"]
  },

  // ─── EBAY ─────────────────────────────────────────────────────────────────
  {
    id: "ebay-001",
    marketplace: "ebay",
    title: "Sony WH-1000XM5 Wireless Headphones - Black",
    price: 249.00,
    currency: "USD",
    rating: 4.6,
    reviewCount: 342,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    seller: "electronics_hub_99",
    shipping: "$5.99",
    deliveryDays: 4,
    inStock: true,
    url: "https://www.ebay.com/itm/12345678",
    category: "electronics",
    brand: "Sony",
    condition: "New",
    tags: ["headphones", "wireless", "noise canceling", "sony", "audio"]
  },
  {
    id: "ebay-002",
    marketplace: "ebay",
    title: "Apple AirPods Pro 2nd Gen - Sealed Box",
    price: 175.00,
    currency: "USD",
    rating: 4.7,
    reviewCount: 891,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop",
    seller: "apple_deals_store",
    shipping: "Free",
    deliveryDays: 3,
    inStock: true,
    url: "https://www.ebay.com/itm/87654321",
    category: "electronics",
    brand: "Apple",
    condition: "New",
    tags: ["earbuds", "wireless", "apple", "airpods", "noise canceling"]
  },
  {
    id: "ebay-003",
    marketplace: "ebay",
    title: "Samsung 65\" 4K QLED Smart TV QN65Q80C",
    price: 749.00,
    currency: "USD",
    rating: 4.3,
    reviewCount: 127,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&h=400&fit=crop",
    seller: "tv_warehouse_us",
    shipping: "$49.00",
    deliveryDays: 7,
    inStock: true,
    url: "https://www.ebay.com/itm/11223344",
    category: "electronics",
    brand: "Samsung",
    condition: "New",
    tags: ["tv", "samsung", "4k", "smart tv", "qled", "television"]
  },
  {
    id: "ebay-004",
    marketplace: "ebay",
    title: "Nike Air Max 270 Running Shoes - Size 10 US",
    price: 89.00,
    currency: "USD",
    rating: 4.2,
    reviewCount: 56,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    seller: "sneaker_vault",
    shipping: "$8.99",
    deliveryDays: 5,
    inStock: true,
    url: "https://www.ebay.com/itm/55443322",
    category: "fashion",
    brand: "Nike",
    condition: "Used",
    tags: ["nike", "shoes", "running", "sneakers", "air max", "men"]
  },
  {
    id: "ebay-005",
    marketplace: "ebay",
    title: "Dyson V15 Detect Absolute Cordless Vacuum",
    price: 449.00,
    currency: "USD",
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    seller: "dyson_official_ebay",
    shipping: "Free",
    deliveryDays: 3,
    inStock: true,
    url: "https://www.ebay.com/itm/99887766",
    category: "home",
    brand: "Dyson",
    condition: "New",
    tags: ["vacuum", "dyson", "cordless", "cleaning", "home appliance"]
  },

  // ─── ALIEXPRESS ───────────────────────────────────────────────────────────
  {
    id: "ali-001",
    marketplace: "aliexpress",
    title: "TWS Bluetooth 5.3 Wireless Earphones Noise Cancelling Headphones",
    price: 24.99,
    currency: "USD",
    rating: 4.3,
    reviewCount: 4521,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    seller: "TechGadget Store",
    shipping: "Free Shipping",
    deliveryDays: 15,
    inStock: true,
    url: "https://www.aliexpress.com/item/1005005",
    category: "electronics",
    brand: "Generic",
    condition: "New",
    tags: ["earbuds", "wireless", "bluetooth", "tws", "noise canceling", "cheap"]
  },
  {
    id: "ali-002",
    marketplace: "aliexpress",
    title: "Smart Watch Men Women 1.9\" Full Touch Fitness Tracker Blood Oxygen",
    price: 18.50,
    currency: "USD",
    rating: 4.1,
    reviewCount: 7832,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    seller: "SmartLife Shop",
    shipping: "Free Shipping",
    deliveryDays: 18,
    inStock: true,
    url: "https://www.aliexpress.com/item/1005006",
    category: "electronics",
    brand: "Generic",
    condition: "New",
    tags: ["smartwatch", "fitness tracker", "watch", "wearable", "health monitor"]
  },
  {
    id: "ali-003",
    marketplace: "aliexpress",
    title: "Portable Blender Mini USB Rechargeable Juicer Cup",
    price: 12.99,
    currency: "USD",
    rating: 4.4,
    reviewCount: 9124,
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop",
    seller: "Kitchen King Store",
    shipping: "Free Shipping",
    deliveryDays: 20,
    inStock: true,
    url: "https://www.aliexpress.com/item/1005007",
    category: "home",
    brand: "Generic",
    condition: "New",
    tags: ["blender", "juicer", "portable", "kitchen", "usb", "mini blender"]
  },
  {
    id: "ali-004",
    marketplace: "aliexpress",
    title: "Men Sneakers Casual Shoes Breathable Lightweight Running Shoes",
    price: 32.00,
    currency: "USD",
    rating: 4.2,
    reviewCount: 3210,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    seller: "Fashion Footwear Co",
    shipping: "$2.99",
    deliveryDays: 22,
    inStock: true,
    url: "https://www.aliexpress.com/item/1005008",
    category: "fashion",
    brand: "Generic",
    condition: "New",
    tags: ["shoes", "sneakers", "running", "men", "casual", "breathable"]
  },

  // ─── TEMU ────────────────────────────────────────────────────────────────
  {
    id: "tem-001",
    marketplace: "temu",
    title: "Samsung Galaxy A54 5G (8GB RAM, 128GB) - Black",
    price: 269.00,
    currency: "USD",
    rating: 4.5,
    reviewCount: 1876,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop",
    seller: "Samsung Direct",
    shipping: "Free",
    deliveryDays: 8,
    inStock: true,
    url: "https://www.temu.com/samsung-galaxy-a54",
    category: "electronics",
    brand: "Samsung",
    condition: "New",
    tags: ["samsung", "phone", "smartphone", "5g", "galaxy", "android"]
  },
  {
    id: "tem-002",
    marketplace: "temu",
    title: "Hisense 43-Inch Full HD Smart TV with Netflix",
    price: 219.00,
    currency: "USD",
    rating: 4.3,
    reviewCount: 765,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400&h=400&fit=crop",
    seller: "Electronics Factory",
    shipping: "Free",
    deliveryDays: 10,
    inStock: true,
    url: "https://www.temu.com/hisense-43-smart-tv",
    category: "electronics",
    brand: "Hisense",
    condition: "New",
    tags: ["tv", "hisense", "smart tv", "netflix", "full hd", "television"]
  },
  {
    id: "tem-003",
    marketplace: "temu",
    title: "Tefal Easy Fry Classic Air Fryer 4.2L",
    price: 69.00,
    currency: "USD",
    rating: 4.6,
    reviewCount: 432,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    seller: "Home Appliances Store",
    shipping: "Free",
    deliveryDays: 12,
    inStock: true,
    url: "https://www.temu.com/tefal-air-fryer",
    category: "home",
    brand: "Tefal",
    condition: "New",
    tags: ["air fryer", "tefal", "kitchen", "cooking", "fryer", "appliance"]
  },
  {
    id: "tem-004",
    marketplace: "temu",
    title: "Adidas Runfalcon 2.0 Running Shoes",
    price: 48.00,
    currency: "USD",
    rating: 4.3,
    reviewCount: 987,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    seller: "Fash-Zone",
    shipping: "Free",
    deliveryDays: 10,
    inStock: true,
    url: "https://www.temu.com/adidas-runfalcon",
    category: "fashion",
    brand: "Adidas",
    condition: "New",
    tags: ["adidas", "shoes", "running", "sneakers", "sports", "men"]
  },
  {
    id: "tem-005",
    marketplace: "temu",
    title: "Anker PowerCore 20000mAh Portable Charger Power Bank",
    price: 29.00,
    currency: "USD",
    rating: 4.7,
    reviewCount: 2341,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
    seller: "Accessory Hub",
    shipping: "Free",
    deliveryDays: 7,
    inStock: true,
    url: "https://www.temu.com/anker-powercore",
    category: "electronics",
    brand: "Anker",
    condition: "New",
    tags: ["power bank", "charger", "anker", "portable", "battery", "20000mah"]
  },

  // ─── HP ELITEBOOK FALLBACKS ─────────────────────────────────────────────
  {
    id: "amz-hp-01",
    marketplace: "amazon",
    title: "HP EliteBook 840 G10 (2024) - 14\" IPS, Intel Core i7-1355U, 16GB RAM, 512GB SSD",
    price: 1149.00,
    currency: "USD",
    rating: 4.6,
    reviewCount: 154,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1611078481174-8313901b009e?w=400&h=400&fit=crop"
    ],
    seller: "Amazon.com",
    shipping: "Free",
    deliveryDays: 2,
    inStock: true,
    url: "https://www.amazon.com/dp/B0CBHP01",
    category: "electronics",
    brand: "HP",
    condition: "New",
    tags: ["hp", "elitebook", "laptop", "business", "intel"]
  },
  {
    id: "ebay-hp-01",
    marketplace: "ebay",
    title: "HP EliteBook 845 G9 14\" WUXGA Ryzen 7 6850U 16GB 512GB SSD Warranty",
    price: 649.99,
    currency: "USD",
    rating: 4.8,
    reviewCount: 42,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
    seller: "refurb-king",
    shipping: "Free",
    deliveryDays: 4,
    inStock: true,
    url: "https://www.ebay.com/itm/ebay-hp-01",
    category: "electronics",
    brand: "HP",
    condition: "Refurbished",
    tags: ["hp", "elitebook", "laptop", "business", "ryzen"]
  },
  {
    id: "ali-hp-01",
    marketplace: "aliexpress",
    title: "Original HP EliteBook 830 G5 13.3 Inch Laptop Intel i5-8250U 8GB RAM 256GB SSD",
    price: 298.50,
    currency: "USD",
    rating: 4.4,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
    seller: "Global Tech PC",
    shipping: "Free Shipping",
    deliveryDays: 20,
    inStock: true,
    url: "https://www.aliexpress.com/item/ali-hp-01.html",
    category: "electronics",
    brand: "HP",
    condition: "Used",
    tags: ["hp", "elitebook", "laptop", "business", "cheap"]
  },
  {
    id: "temu-hp-01",
    marketplace: "temu",
    title: "HP EliteBook 640 G9 14\" FHD Business Laptop Intel Core i5-1235U 16GB 512GB",
    price: 529.00,
    currency: "USD",
    rating: 4.5,
    reviewCount: 28,
    image: "https://images.unsplash.com/photo-1611078481174-8313901b009e?w=400&h=400&fit=crop",
    seller: "Elite Electronics",
    shipping: "Free",
    deliveryDays: 12,
    inStock: true,
    url: "https://www.temu.com/hp-elitebook-640",
    category: "electronics",
    brand: "HP",
    condition: "New",
    tags: ["hp", "elitebook", "laptop", "business", "intel"]
  },

  // ─── TOYS ─────────────────────────────────────────────────────────────────
  {
    id: "amz-toy-001",
    marketplace: "amazon",
    title: "LEGO Star Wars Millennium Falcon Building Set",
    price: 149.99,
    currency: "USD",
    rating: 4.8,
    reviewCount: 5678,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop",
    seller: "LEGO",
    shipping: "Free",
    deliveryDays: 2,
    inStock: true,
    url: "https://www.amazon.com/dp/B07XJ4CZ4F",
    category: "toys",
    brand: "LEGO",
    condition: "New",
    tags: ["lego", "star wars", "building set", "millennium falcon", "toys"]
  },
  {
    id: "amz-toy-002",
    marketplace: "amazon",
    title: "Barbie Dreamhouse Dollhouse with Furniture",
    price: 199.99,
    currency: "USD",
    rating: 4.6,
    reviewCount: 3421,
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop",
    seller: "Mattel",
    shipping: "Free",
    deliveryDays: 3,
    inStock: true,
    url: "https://www.amazon.com/dp/B084D8GZQV",
    category: "toys",
    brand: "Barbie",
    condition: "New",
    tags: ["barbie", "dollhouse", "toys", "kids", "playset"]
  },
  {
    id: "ali-toy-001",
    marketplace: "aliexpress",
    title: "Remote Control Car 4WD Off-Road Monster Truck",
    price: 35.99,
    currency: "USD",
    rating: 4.3,
    reviewCount: 1234,
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop",
    seller: "Toy World Store",
    shipping: "Free Shipping",
    deliveryDays: 18,
    inStock: true,
    url: "https://www.aliexpress.com/item/1005009",
    category: "toys",
    brand: "Generic",
    condition: "New",
    tags: ["rc car", "remote control", "monster truck", "toys", "kids"]
  },
  {
    id: "ebay-toy-001",
    marketplace: "ebay",
    title: "Nerf Elite 2.0 Commander RD-6 Blaster",
    price: 24.99,
    currency: "USD",
    rating: 4.5,
    reviewCount: 876,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop",
    seller: "toy_deals_us",
    shipping: "$4.99",
    deliveryDays: 5,
    inStock: true,
    url: "https://www.ebay.com/itm/nerf-commander",
    category: "toys",
    brand: "Nerf",
    condition: "New",
    tags: ["nerf", "blaster", "foam dart", "toys", "kids"]
  },

  // ─── SPORTS ───────────────────────────────────────────────────────────────
  {
    id: "amz-sport-001",
    marketplace: "amazon",
    title: "Wilson NBA Official Game Basketball",
    price: 69.99,
    currency: "USD",
    rating: 4.7,
    reviewCount: 8901,
    image: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=400&h=400&fit=crop",
    seller: "Wilson",
    shipping: "Free",
    deliveryDays: 2,
    inStock: true,
    url: "https://www.amazon.com/dp/B07XJ4CZ4G",
    category: "sports",
    brand: "Wilson",
    condition: "New",
    tags: ["basketball", "nba", "wilson", "sports", "ball"]
  },
  {
    id: "amz-sport-002",
    marketplace: "amazon",
    title: "Yoga Mat Premium Non-Slip Exercise Mat",
    price: 29.99,
    currency: "USD",
    rating: 4.5,
    reviewCount: 4567,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    seller: "BalanceFrom",
    shipping: "Free",
    deliveryDays: 2,
    inStock: true,
    url: "https://www.amazon.com/dp/B07XJ4CZ4H",
    category: "sports",
    brand: "BalanceFrom",
    condition: "New",
    tags: ["yoga mat", "exercise", "fitness", "sports", "workout"]
  },
  {
    id: "ali-sport-001",
    marketplace: "aliexpress",
    title: "Adjustable Dumbbells Set Home Gym Equipment",
    price: 89.99,
    currency: "USD",
    rating: 4.4,
    reviewCount: 2345,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop",
    seller: "Fitness Pro Store",
    shipping: "Free Shipping",
    deliveryDays: 20,
    inStock: true,
    url: "https://www.aliexpress.com/item/1005010",
    category: "sports",
    brand: "Generic",
    condition: "New",
    tags: ["dumbbells", "weights", "home gym", "fitness", "sports"]
  },

  // ─── BOOKS ─────────────────────────────────────────────────────────────────
  {
    id: "amz-book-001",
    marketplace: "amazon",
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
    price: 16.99,
    currency: "USD",
    rating: 4.8,
    reviewCount: 123456,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    seller: "Amazon",
    shipping: "Free",
    deliveryDays: 2,
    inStock: true,
    url: "https://www.amazon.com/dp/B07XJ4CZ4J",
    category: "books",
    brand: "James Clear",
    condition: "New",
    tags: ["book", "self help", "habits", "non-fiction", "bestseller"]
  },
  {
    id: "amz-book-002",
    marketplace: "amazon",
    title: "The Midnight Library: A Novel",
    price: 14.99,
    currency: "USD",
    rating: 4.6,
    reviewCount: 67890,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    seller: "Amazon",
    shipping: "Free",
    deliveryDays: 2,
    inStock: true,
    url: "https://www.amazon.com/dp/B07XJ4CZ4K",
    category: "books",
    brand: "Matt Haig",
    condition: "New",
    tags: ["book", "fiction", "novel", "bestseller", "literature"]
  },
  {
    id: "ali-book-001",
    marketplace: "aliexpress",
    title: "Harry Potter Complete 7-Book Box Set",
    price: 45.99,
    currency: "USD",
    rating: 4.7,
    reviewCount: 3456,
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=400&fit=crop",
    seller: "Book Haven",
    shipping: "Free Shipping",
    deliveryDays: 25,
    inStock: true,
    url: "https://www.aliexpress.com/item/1005011",
    category: "books",
    brand: "J.K. Rowling",
    condition: "New",
    tags: ["harry potter", "books", "fantasy", "box set", "fiction"]
  },

  // ─── BEAUTY ────────────────────────────────────────────────────────────────
  {
    id: "amz-beauty-001",
    marketplace: "amazon",
    title: "Olay Regenerist Micro-Sculpting Cream Moisturizer",
    price: 28.99,
    currency: "USD",
    rating: 4.6,
    reviewCount: 23456,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    seller: "Olay",
    shipping: "Free",
    deliveryDays: 2,
    inStock: true,
    url: "https://www.amazon.com/dp/B07XJ4CZ4L",
    category: "beauty",
    brand: "Olay",
    condition: "New",
    tags: ["moisturizer", "skincare", "anti-aging", "beauty", "face cream"]
  },
  {
    id: "ali-beauty-001",
    marketplace: "aliexpress",
    title: "Makeup Brush Set Professional 32 Pieces Kit",
    price: 18.99,
    currency: "USD",
    rating: 4.4,
    reviewCount: 5678,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    seller: "Beauty World",
    shipping: "Free Shipping",
    deliveryDays: 15,
    inStock: true,
    url: "https://www.aliexpress.com/item/1005012",
    category: "beauty",
    brand: "Generic",
    condition: "New",
    tags: ["makeup brushes", "makeup", "beauty", "cosmetics", "brush set"]
  },

  // ─── AUTOMOTIVE ───────────────────────────────────────────────────────────
  {
    id: "amz-auto-001",
    marketplace: "amazon",
    title: "LEGO Technic Porsche 911 RSR Building Kit",
    price: 129.99,
    currency: "USD",
    rating: 4.8,
    reviewCount: 4567,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=400&fit=crop",
    seller: "LEGO",
    shipping: "Free",
    deliveryDays: 2,
    inStock: true,
    url: "https://www.amazon.com/dp/B07XJ4CZ4M",
    category: "automotive",
    brand: "LEGO",
    condition: "New",
    tags: ["lego", "porsche", "car", "building kit", "automotive"]
  },
  {
    id: "ali-auto-001",
    marketplace: "aliexpress",
    title: "Car Phone Mount Universal Dashboard Holder",
    price: 8.99,
    currency: "USD",
    rating: 4.3,
    reviewCount: 7890,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=400&fit=crop",
    seller: "Auto Accessories",
    shipping: "Free Shipping",
    deliveryDays: 12,
    inStock: true,
    url: "https://www.aliexpress.com/item/1005013",
    category: "automotive",
    brand: "Generic",
    condition: "New",
    tags: ["phone mount", "car accessories", "dashboard", "automotive", "phone holder"]
  }
];

/**
 * Search products by keyword across all or specific marketplaces.
 * @param {string} query
 * @param {Object} options - { marketplace, category, minPrice, maxPrice, minRating, sortBy }
 * @returns {Array}
 */
function searchProducts(query, options = {}) {
  const q = query.toLowerCase().trim();
  const { marketplace, category, minPrice, maxPrice, minRating, sortBy } = options;

  let results = mockProducts.filter(product => {
    const matchesQuery =
      product.title.toLowerCase().includes(q) ||
      product.tags.some(tag => tag.includes(q)) ||
      product.brand.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q);

    if (!matchesQuery) return false;

    if (marketplace && marketplace !== "all" && product.marketplace !== marketplace) return false;
    if (category && category !== "all" && product.category !== category) return false;
    if (minPrice && product.price < parseFloat(minPrice)) return false;
    if (maxPrice && product.price > parseFloat(maxPrice)) return false;
    if (minRating && product.rating < parseFloat(minRating)) return false;

    return true;
  });

  // Sorting
  switch (sortBy) {
    case "price_asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "popularity":
      results.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      // relevance — no sort change
      break;
  }

  return results;
}

/**
 * Get a product by ID.
 */
function getProductById(id) {
  return mockProducts.find(p => p.id === id) || null;
}

/**
 * Get multiple products by IDs (for comparison).
 */
function getProductsByIds(ids) {
  return ids.map(id => getProductById(id)).filter(Boolean);
}

module.exports = { mockProducts, searchProducts, getProductById, getProductsByIds };
