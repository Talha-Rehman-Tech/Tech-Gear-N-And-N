export interface ProductItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  description: string;
  category: { _id?: string; name: string; slug: string } | string;
  stock: number;
  images: Array<{ url: string; public_id: string }>;
  variants: Array<{ color: string; stock: number }>;
  brand: string;
  ratings: number;
  numOfReviews: number;
  isFeatured: boolean;
  specifications: Array<{ key: string; value: string }>;
}

export const DEFAULT_PRODUCTS: ProductItem[] = [
  // 1. Fast Chargers
  {
    _id: '66e1001a1b2c3d4e5f600001',
    name: '65W GaN Fast Charger Ultra Pro',
    price: 2999,
    discountPrice: 3499,
    description: 'Compact 65W charger with dual USB Type-C and USB-A ports. Powered by next-gen GaN III technology for safe, high-speed charging.',
    category: { _id: 'cat_chargers', name: 'Fast Chargers', slug: 'fast-chargers' },
    stock: 50,
    images: [{ url: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=600&auto=format&fit=crop', public_id: 'img1' }],
    variants: [{ color: 'White', stock: 25 }, { color: 'Black', stock: 25 }],
    brand: 'Anker Tech',
    ratings: 4.8,
    numOfReviews: 124,
    isFeatured: true,
    specifications: [
      { key: 'Total Output', value: '65W Max' },
      { key: 'Technology', value: 'GaN III Fast Charge' },
      { key: 'Ports', value: '2x Type-C, 1x USB-A' }
    ]
  },
  {
    _id: '66e1001a1b2c3d4e5f600002',
    name: '100W GaN 4-Port Desktop Charging Station',
    price: 4999,
    discountPrice: 5999,
    description: 'Universal high-power charging hub suitable for laptops, tablets, and smartphones simultaneously with smart temperature control.',
    category: { _id: 'cat_chargers', name: 'Fast Chargers', slug: 'fast-chargers' },
    stock: 35,
    images: [{ url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=600&auto=format&fit=crop', public_id: 'img2' }],
    variants: [{ color: 'Space Gray', stock: 20 }, { color: 'Matte Black', stock: 15 }],
    brand: 'Baseus Tech',
    ratings: 4.9,
    numOfReviews: 89,
    isFeatured: true,
    specifications: [
      { key: 'Total Output', value: '100W PD 3.0' },
      { key: 'Ports', value: '3x Type-C, 1x USB-A' }
    ]
  },

  // 2. Earbuds & Buds
  {
    _id: '66e1001a1b2c3d4e5f600003',
    name: 'AirPulse Pro Active ANC Wireless Earbuds',
    price: 4499,
    discountPrice: 5499,
    description: 'Active Noise Cancelling TWS earbuds with ultra-low latency game mode, spatial audio, punchy bass, and 36-hour total battery life with case.',
    category: { _id: 'cat_earbuds', name: 'Wireless Earbuds', slug: 'earbuds' },
    stock: 100,
    images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop', public_id: 'img3' }],
    variants: [{ color: 'Glossy White', stock: 60 }, { color: 'Midnight Black', stock: 40 }],
    brand: 'TechGear',
    ratings: 4.8,
    numOfReviews: 210,
    isFeatured: true,
    specifications: [
      { key: 'Noise Cancellation', value: '-35dB Hybrid Active ANC' },
      { key: 'Battery Life', value: '36 Hours with Case' },
      { key: 'Water Resistance', value: 'IPX5 Sweatproof' }
    ]
  },
  {
    _id: '66e1001a1b2c3d4e5f600004',
    name: 'SportPods Waterproof Sport Wireless Earbuds',
    price: 3299,
    discountPrice: 3999,
    description: 'Ergonomic silicone ear-hook Bluetooth earbuds designed for workouts and outdoor running with intense bass and 45h playtime.',
    category: { _id: 'cat_earbuds', name: 'Wireless Earbuds', slug: 'earbuds' },
    stock: 45,
    images: [{ url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=600&auto=format&fit=crop', public_id: 'img4' }],
    variants: [{ color: 'Sport Green', stock: 25 }, { color: 'Stealth Black', stock: 20 }],
    brand: 'SoundWave',
    ratings: 4.7,
    numOfReviews: 95,
    isFeatured: true,
    specifications: [
      { key: 'Protection', value: 'IPX7 Fully Waterproof' },
      { key: 'Bluetooth', value: 'v5.3 Instant Pair' },
      { key: 'Battery', value: '45h Total Playtime' }
    ]
  },

  // 3. Over-Ear Headphones
  {
    _id: '66e1001a1b2c3d4e5f600005',
    name: 'StudioPro ANC Wireless Over-Ear Headphones',
    price: 8999,
    discountPrice: 10999,
    description: 'High-Fidelity studio sound with 40mm titanium acoustic drivers, hybrid noise cancellation, plush memory foam ear cushions, and 60-hour playback.',
    category: { _id: 'cat_headphones', name: 'Headphones', slug: 'headphones' },
    stock: 20,
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', public_id: 'img5' }],
    variants: [{ color: 'Silver Chrome', stock: 10 }, { color: 'Matte Black', stock: 10 }],
    brand: 'SoundWave Pro',
    ratings: 4.9,
    numOfReviews: 142,
    isFeatured: true,
    specifications: [
      { key: 'Driver Size', value: '40mm Titanium Drivers' },
      { key: 'Noise Cancellation', value: '-38dB Hybrid ANC' },
      { key: 'Battery', value: '60h Playtime' }
    ]
  },
  {
    _id: '66e1001a1b2c3d4e5f600006',
    name: 'BassSurge 7.1 RGB Pro Gaming Headset',
    price: 4299,
    discountPrice: 4999,
    description: 'Immersive 7.1 virtual surround sound headset with detachable noise-cancelling boom mic, dynamic RGB earcups, and cooling gel cushions.',
    category: { _id: 'cat_headphones', name: 'Headphones', slug: 'headphones' },
    stock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop', public_id: 'img6' }],
    variants: [{ color: 'Carbon Black', stock: 30 }],
    brand: 'SteelSound',
    ratings: 4.8,
    numOfReviews: 88,
    isFeatured: false,
    specifications: [
      { key: 'Surround Sound', value: '7.1 Virtual Spatial Audio' },
      { key: 'Microphone', value: 'Broadcast-grade Noise Reduction' },
      { key: 'Cable', value: '2.2m Braided USB & 3.5mm' }
    ]
  },

  // 4. Keyboards
  {
    _id: '66e1001a1b2c3d4e5f600007',
    name: 'Apex Pro RGB Mechanical Gaming Keyboard',
    price: 7499,
    discountPrice: 8999,
    description: 'Full-size mechanical gaming keyboard with hot-swappable tactile switches, per-key RGB backlighting, aviation aluminum top plate, and detachable Type-C cable.',
    category: { _id: 'cat_keyboards', name: 'Keyboards', slug: 'keyboards' },
    stock: 25,
    images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop', public_id: 'img7' }],
    variants: [{ color: 'Tactile Blue Switches', stock: 15 }, { color: 'Linear Red Switches', stock: 10 }],
    brand: 'KeyChron Pro',
    ratings: 4.9,
    numOfReviews: 156,
    isFeatured: true,
    specifications: [
      { key: 'Switch Type', value: 'Hot-Swappable Mechanical' },
      { key: 'Backlight', value: '16.8M Color Per-Key RGB' },
      { key: 'Frame', value: 'Aircraft-grade Aluminum' }
    ]
  },
  {
    _id: '66e1001a1b2c3d4e5f600008',
    name: 'SlimKey Wireless Dual-Mode Bluetooth Keyboard',
    price: 3999,
    discountPrice: 4599,
    description: 'Ultra-thin wireless keyboard with whisper-quiet scissor switches. Easily connects up to 3 devices with seamless Bluetooth and 2.4GHz switching.',
    category: { _id: 'cat_keyboards', name: 'Keyboards', slug: 'keyboards' },
    stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=600&auto=format&fit=crop', public_id: 'img8' }],
    variants: [{ color: 'Space Gray', stock: 20 }, { color: 'Silver White', stock: 20 }],
    brand: 'LogiTech Gear',
    ratings: 4.7,
    numOfReviews: 68,
    isFeatured: true,
    specifications: [
      { key: 'Profile', value: 'Ultra-Slim Ergonomic' },
      { key: 'Battery', value: 'Rechargeable 500mAh USB-C' },
      { key: 'Compatibility', value: 'Windows, macOS, iOS, Android' }
    ]
  },

  // 5. Gaming & Office Mice
  {
    _id: '66e1001a1b2c3d4e5f600009',
    name: 'Viper X Ultralight RGB Gaming Mouse',
    price: 2999,
    discountPrice: 3599,
    description: 'Honeycomb 65g lightweight gaming mouse equipped with a 16,000 DPI high-speed optical sensor, PTFE glide feet, and flexible paracord cable.',
    category: { _id: 'cat_mice', name: 'Mice', slug: 'mice' },
    stock: 60,
    images: [{ url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop', public_id: 'img9' }],
    variants: [{ color: 'Matte Black', stock: 35 }, { color: 'Glacier White', stock: 25 }],
    brand: 'RazerTech',
    ratings: 4.8,
    numOfReviews: 182,
    isFeatured: true,
    specifications: [
      { key: 'Sensor', value: '16,000 DPI Optical Sensor' },
      { key: 'Weight', value: '65 Grams Ultralight' },
      { key: 'Buttons', value: '6 Programmable Buttons' }
    ]
  },
  {
    _id: '66e1001a1b2c3d4e5f600010',
    name: 'MasterGlide Silent Ergonomic Wireless Mouse',
    price: 1899,
    discountPrice: 2299,
    description: 'Quiet-click ergonomic wireless mouse with comfortable thumb rest, dual Bluetooth 5.0 and 2.4GHz USB receiver, and smooth optical tracking.',
    category: { _id: 'cat_mice', name: 'Mice', slug: 'mice' },
    stock: 75,
    images: [{ url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop', public_id: 'img10' }],
    variants: [{ color: 'Graphite', stock: 45 }, { color: 'Rose Pink', stock: 30 }],
    brand: 'LogiTech Gear',
    ratings: 4.8,
    numOfReviews: 114,
    isFeatured: false,
    specifications: [
      { key: 'Noise Reduction', value: '90% Silent Click' },
      { key: 'Battery', value: 'Up to 18 Months on 1x AA' },
      { key: 'Connection', value: 'Bluetooth + 2.4GHz Nano USB' }
    ]
  },

  // 6. Wireless Devices & Docks
  {
    _id: '66e1001a1b2c3d4e5f600011',
    name: 'MagStand 3-in-1 Foldable Wireless Charging Station',
    price: 4899,
    discountPrice: 5799,
    description: 'All-in-one magnetic wireless charging dock. Simultaneously powers iPhone (15W MagSafe), Smartwatch (5W), and AirPods/Buds (5W) with travel foldability.',
    category: { _id: 'cat_wireless', name: 'Wireless Devices & Docks', slug: 'wireless-devices' },
    stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1622445262464-84b14e572007?q=80&w=600&auto=format&fit=crop', public_id: 'img11' }],
    variants: [{ color: 'Titanium Gray', stock: 25 }, { color: 'Pearl White', stock: 15 }],
    brand: 'MagCharge',
    ratings: 4.9,
    numOfReviews: 92,
    isFeatured: true,
    specifications: [
      { key: 'Phone Output', value: '15W MagSafe Fast Magnetic' },
      { key: 'Watch Output', value: '5W Dedicated Wireless' },
      { key: 'Buds Output', value: '5W Qi Inductive Base' }
    ]
  },
  {
    _id: '66e1001a1b2c3d4e5f600012',
    name: 'AeroCharge 15W Qi Fast Wireless Charging Pad',
    price: 1999,
    discountPrice: 2499,
    description: 'Ultra-thin aluminum Qi wireless pad with intelligent temperature management, anti-slip rubber ring, and foreign body safety detection.',
    category: { _id: 'cat_wireless', name: 'Wireless Devices & Docks', slug: 'wireless-devices' },
    stock: 80,
    images: [{ url: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=600&auto=format&fit=crop', public_id: 'img12' }],
    variants: [{ color: 'Midnight Black', stock: 50 }, { color: 'Silver', stock: 30 }],
    brand: 'Anker Tech',
    ratings: 4.7,
    numOfReviews: 83,
    isFeatured: false,
    specifications: [
      { key: 'Max Speed', value: '15W Fast Wireless' },
      { key: 'Thickness', value: '5.5mm Ultra-Slim' },
      { key: 'Material', value: 'Anodized Aluminum' }
    ]
  },

  // 7. USB & Flash Drives
  {
    _id: '66e1001a1b2c3d4e5f600013',
    name: 'UltraSpeed 128GB Dual Type-C & USB 3.2 OTG Drive',
    price: 2499,
    discountPrice: 2999,
    description: 'High-speed dual-interface flash drive with USB-C and standard USB-A. Effortlessly moves photos, 4K videos, and data between phones, tablets, and PCs.',
    category: { _id: 'cat_usb', name: 'USB & Flash Drives', slug: 'usb-drives' },
    stock: 120,
    images: [{ url: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=600&auto=format&fit=crop', public_id: 'img13' }],
    variants: [{ color: 'Brushed Metal', stock: 120 }],
    brand: 'SanDisk Tech',
    ratings: 4.9,
    numOfReviews: 240,
    isFeatured: true,
    specifications: [
      { key: 'Capacity', value: '128GB High-Speed' },
      { key: 'Read Speed', value: 'Up to 400MB/s' },
      { key: 'Connectors', value: 'Type-C & Type-A Swivel' }
    ]
  },
  {
    _id: '66e1001a1b2c3d4e5f600014',
    name: 'TitanVault 64GB Metal Waterproof USB 3.0 Drive',
    price: 1499,
    discountPrice: 1799,
    description: 'Rugged unibody zinc-alloy USB drive that is waterproof, dustproof, and shock-resistant. Features built-in key ring loop for daily carry.',
    category: { _id: 'cat_usb', name: 'USB & Flash Drives', slug: 'usb-drives' },
    stock: 90,
    images: [{ url: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?q=80&w=600&auto=format&fit=crop', public_id: 'img14' }],
    variants: [{ color: 'Silver Steel', stock: 90 }],
    brand: 'Kingston Pro',
    ratings: 4.8,
    numOfReviews: 110,
    isFeatured: false,
    specifications: [
      { key: 'Capacity', value: '64GB Flash Storage' },
      { key: 'Durability', value: 'Waterproof & Shockproof Unibody' },
      { key: 'Speed', value: 'USB 3.0 150MB/s' }
    ]
  },

  // 8. Power Banks
  {
    _id: '66e1001a1b2c3d4e5f600015',
    name: '10,000mAh MagSafe Magnetic Power Bank',
    price: 3499,
    discountPrice: 3999,
    description: 'Ultra-thin wireless magnetic power bank with strong snap-on magnets and 20W PD Type-C fast wired charging.',
    category: { _id: 'cat_powerbanks', name: 'Power Banks', slug: 'power-banks' },
    stock: 30,
    images: [{ url: 'https://images.unsplash.com/photo-1610945400287-34758564e9a3?q=80&w=600&auto=format&fit=crop', public_id: 'img15' }],
    variants: [{ color: 'Black', stock: 15 }, { color: 'Silver', stock: 15 }],
    brand: 'MagCharge',
    ratings: 4.6,
    numOfReviews: 64,
    isFeatured: true,
    specifications: [
      { key: 'Capacity', value: '10,000mAh / 37Wh' },
      { key: 'Wireless Output', value: '15W Fast Magnetic' }
    ]
  },
  {
    _id: '66e1001a1b2c3d4e5f600016',
    name: '20,000mAh 65W Laptop Power Bank',
    price: 5499,
    discountPrice: 6200,
    description: 'High capacity power bank capable of charging MacBooks, Dell XPS, and fast charging up to 3 devices simultaneously.',
    category: { _id: 'cat_powerbanks', name: 'Power Banks', slug: 'power-banks' },
    stock: 22,
    images: [{ url: 'https://images.unsplash.com/photo-1609592424361-9c8699745e14?q=80&w=600&auto=format&fit=crop', public_id: 'img16' }],
    variants: [{ color: 'Deep Black', stock: 22 }],
    brand: 'Baseus Tech',
    ratings: 4.8,
    numOfReviews: 142,
    isFeatured: true,
    specifications: [
      { key: 'Capacity', value: '20,000mAh' },
      { key: 'Output', value: '65W Power Delivery' }
    ]
  },

  // 9. Durable Cables
  {
    _id: '66e1001a1b2c3d4e5f600017',
    name: 'Type-C to Lightning Braided Cable (2m)',
    price: 999,
    discountPrice: 1299,
    description: 'MFi-certified durable nylon braided fast charging cable tested for 30,000+ bends.',
    category: { _id: 'cat_cables', name: 'Durable Cables', slug: 'cables' },
    stock: 200,
    images: [{ url: 'https://images.unsplash.com/photo-1584006682522-dc17d6c0d06c?q=80&w=600&auto=format&fit=crop', public_id: 'img17' }],
    variants: [{ color: 'Red', stock: 100 }, { color: 'Black', stock: 100 }],
    brand: 'Anker Tech',
    ratings: 4.9,
    numOfReviews: 320,
    isFeatured: true,
    specifications: [
      { key: 'Length', value: '2 Meters' },
      { key: 'Material', value: 'Military-grade Nylon' }
    ]
  },
  {
    _id: '66e1001a1b2c3d4e5f600018',
    name: '100W 5A E-Marker USB-C to USB-C Cable',
    price: 1199,
    discountPrice: 1499,
    description: 'Heavy duty 100W USB-C cable with LED digital power display meter in zinc-alloy housing.',
    category: { _id: 'cat_cables', name: 'Durable Cables', slug: 'cables' },
    stock: 75,
    images: [{ url: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?q=80&w=600&auto=format&fit=crop', public_id: 'img18' }],
    variants: [{ color: 'Gray', stock: 75 }],
    brand: 'TechGear',
    ratings: 4.8,
    numOfReviews: 95,
    isFeatured: true,
    specifications: [
      { key: 'Power Display', value: 'Real-time Wattage LED' },
      { key: 'Charging Speed', value: '100W (20V/5A)' }
    ]
  }
];
