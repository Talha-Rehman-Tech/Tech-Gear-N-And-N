const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');
const Shop = require('./models/Shop');
const fs = require('fs');
const path = require('path');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Shop.deleteMany();
    await Shop.collection.dropIndexes().catch(() => {});

    // 1. Seed Categories
    const categoriesData = [
      { name: 'Fast Chargers', slug: 'fast-chargers' },
      { name: 'Wireless Earbuds', slug: 'earbuds' },
      { name: 'Headphones', slug: 'headphones' },
      { name: 'Keyboards', slug: 'keyboards' },
      { name: 'Mice', slug: 'mice' },
      { name: 'Wireless Devices & Docks', slug: 'wireless-devices' },
      { name: 'USB & Flash Drives', slug: 'usb-drives' },
      { name: 'Power Banks', slug: 'power-banks' },
      { name: 'Durable Cables', slug: 'cables' }
    ];
    const insertedCategories = await Category.insertMany(categoriesData);
    
    const catChargers = insertedCategories.find(c => c.slug === 'fast-chargers');
    const catEarbuds = insertedCategories.find(c => c.slug === 'earbuds');
    const catHeadphones = insertedCategories.find(c => c.slug === 'headphones');
    const catKeyboards = insertedCategories.find(c => c.slug === 'keyboards');
    const catMice = insertedCategories.find(c => c.slug === 'mice');
    const catWireless = insertedCategories.find(c => c.slug === 'wireless-devices');
    const catUsb = insertedCategories.find(c => c.slug === 'usb-drives');
    const catPowerBanks = insertedCategories.find(c => c.slug === 'power-banks');
    const catCables = insertedCategories.find(c => c.slug === 'cables');

    // 2. Seed Users (Admin & Customer)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const usersData = [
      {
        name: 'Admin Talha',
        email: 'admin@techgear.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+92 300 9998877',
        address: 'TechGear HQ, IT Park, Lahore'
      },
      {
        name: 'John Customer',
        email: 'customer@techgear.com',
        password: hashedPassword,
        role: 'user',
        phone: '+92 300 1234567',
        address: 'House #45, Street 12, Gulberg III, Lahore'
      }
    ];

    await User.insertMany(usersData);
    console.log('Admin user created: admin@techgear.com / password123');
    console.log('Customer user created: customer@techgear.com / password123');

    // 3. Seed Products
    const products = [
      {
        name: '65W GaN Fast Charger Ultra Pro',
        price: 2999,
        discountPrice: 3499,
        description: 'Compact 65W charger with dual USB Type-C and USB-A ports. Powered by next-gen GaN III technology for safe, high-speed charging.',
        category: catChargers._id,
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
        name: '100W GaN 4-Port Desktop Charging Station',
        price: 4999,
        discountPrice: 5999,
        description: 'Universal high-power charging hub suitable for laptops, tablets, and smartphones simultaneously with smart temperature control.',
        category: catChargers._id,
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
      {
        name: 'AirPulse Pro Active ANC Wireless Earbuds',
        price: 4499,
        discountPrice: 5499,
        description: 'Active Noise Cancelling TWS earbuds with ultra-low latency game mode, punchy bass, and 36-hour total battery life with case.',
        category: catEarbuds._id,
        stock: 100,
        images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop', public_id: 'img3' }],
        variants: [{ color: 'White', stock: 60 }, { color: 'Midnight Black', stock: 40 }],
        brand: 'TechGear',
        ratings: 4.8,
        numOfReviews: 210,
        isFeatured: true,
        specifications: [
          { key: 'Noise Cancellation', value: '-35dB Active ANC' },
          { key: 'Battery Life', value: '36 Hours' },
          { key: 'Water Resistance', value: 'IPX5' }
        ]
      },
      {
        name: 'SportPods Waterproof Sport Wireless Earbuds',
        price: 3299,
        discountPrice: 3999,
        description: 'Ergonomic silicone ear-hook Bluetooth earbuds designed for workouts with intense bass and 45h playtime.',
        category: catEarbuds._id,
        stock: 45,
        images: [{ url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=600&auto=format&fit=crop', public_id: 'img4' }],
        variants: [{ color: 'Sport Green', stock: 25 }, { color: 'Stealth Black', stock: 20 }],
        brand: 'SoundWave',
        ratings: 4.7,
        numOfReviews: 95,
        isFeatured: true,
        specifications: [
          { key: 'Protection', value: 'IPX7 Waterproof' },
          { key: 'Bluetooth', value: 'v5.3' },
          { key: 'Battery', value: '45h Playtime' }
        ]
      },
      {
        name: 'StudioPro ANC Wireless Over-Ear Headphones',
        price: 8999,
        discountPrice: 10999,
        description: 'High-Fidelity studio sound with 40mm titanium drivers, plush memory foam ear cushions, and 60-hour playback.',
        category: catHeadphones._id,
        stock: 20,
        images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', public_id: 'img5' }],
        variants: [{ color: 'Silver', stock: 10 }, { color: 'Black', stock: 10 }],
        brand: 'SoundWave Pro',
        ratings: 4.9,
        numOfReviews: 142,
        isFeatured: true,
        specifications: [
          { key: 'Driver Size', value: '40mm Dynamic Drivers' },
          { key: 'Battery', value: '60h Playtime' }
        ]
      },
      {
        name: 'BassSurge 7.1 RGB Pro Gaming Headset',
        price: 4299,
        discountPrice: 4999,
        description: 'Immersive 7.1 virtual surround sound headset with detachable noise-cancelling boom mic and dynamic RGB earcups.',
        category: catHeadphones._id,
        stock: 30,
        images: [{ url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop', public_id: 'img6' }],
        variants: [{ color: 'Carbon Black', stock: 30 }],
        brand: 'SteelSound',
        ratings: 4.8,
        numOfReviews: 88,
        isFeatured: false,
        specifications: [
          { key: 'Surround Sound', value: '7.1 Virtual Spatial Audio' },
          { key: 'Microphone', value: 'Noise-Isolating Mic' }
        ]
      },
      {
        name: 'Apex Pro RGB Mechanical Gaming Keyboard',
        price: 7499,
        discountPrice: 8999,
        description: 'Full-size mechanical gaming keyboard with hot-swappable tactile switches, per-key RGB backlighting, and aluminum frame.',
        category: catKeyboards._id,
        stock: 25,
        images: [{ url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop', public_id: 'img7' }],
        variants: [{ color: 'Blue Switch', stock: 15 }, { color: 'Red Switch', stock: 10 }],
        brand: 'KeyChron Pro',
        ratings: 4.9,
        numOfReviews: 156,
        isFeatured: true,
        specifications: [
          { key: 'Switch Type', value: 'Hot-Swappable Mechanical' },
          { key: 'Backlight', value: '16.8M Color Per-Key RGB' }
        ]
      },
      {
        name: 'SlimKey Wireless Dual-Mode Bluetooth Keyboard',
        price: 3999,
        discountPrice: 4599,
        description: 'Ultra-thin wireless keyboard with whisper-quiet scissor switches. Connects up to 3 devices simultaneously.',
        category: catKeyboards._id,
        stock: 40,
        images: [{ url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=600&auto=format&fit=crop', public_id: 'img8' }],
        variants: [{ color: 'Space Gray', stock: 20 }, { color: 'Silver White', stock: 20 }],
        brand: 'LogiTech Gear',
        ratings: 4.7,
        numOfReviews: 68,
        isFeatured: true,
        specifications: [
          { key: 'Profile', value: 'Ultra-Slim Ergonomic' },
          { key: 'Battery', value: 'Rechargeable 500mAh USB-C' }
        ]
      },
      {
        name: 'Viper X Ultralight RGB Gaming Mouse',
        price: 2999,
        discountPrice: 3599,
        description: 'Honeycomb 65g lightweight gaming mouse equipped with 16,000 DPI high-speed optical sensor and flexible paracord cable.',
        category: catMice._id,
        stock: 60,
        images: [{ url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop', public_id: 'img9' }],
        variants: [{ color: 'Matte Black', stock: 35 }, { color: 'Glacier White', stock: 25 }],
        brand: 'RazerTech',
        ratings: 4.8,
        numOfReviews: 182,
        isFeatured: true,
        specifications: [
          { key: 'Sensor', value: '16,000 DPI Optical' },
          { key: 'Weight', value: '65g Featherlight' }
        ]
      },
      {
        name: 'MasterGlide Silent Ergonomic Wireless Mouse',
        price: 1899,
        discountPrice: 2299,
        description: 'Quiet-click ergonomic wireless mouse with comfortable thumb rest and dual Bluetooth 5.0 + 2.4GHz USB receiver.',
        category: catMice._id,
        stock: 75,
        images: [{ url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop', public_id: 'img10' }],
        variants: [{ color: 'Graphite', stock: 45 }, { color: 'Rose Pink', stock: 30 }],
        brand: 'LogiTech Gear',
        ratings: 4.8,
        numOfReviews: 114,
        isFeatured: false,
        specifications: [
          { key: 'Noise Reduction', value: '90% Silent Click' },
          { key: 'Battery', value: 'Up to 18 Months' }
        ]
      },
      {
        name: 'MagStand 3-in-1 Foldable Wireless Charging Station',
        price: 4899,
        discountPrice: 5799,
        description: 'All-in-one magnetic wireless charging dock for phone (15W MagSafe), watch (5W), and earbuds (5W).',
        category: catWireless._id,
        stock: 40,
        images: [{ url: 'https://images.unsplash.com/photo-1622445262464-84b14e572007?q=80&w=600&auto=format&fit=crop', public_id: 'img11' }],
        variants: [{ color: 'Titanium Gray', stock: 25 }, { color: 'Pearl White', stock: 15 }],
        brand: 'MagCharge',
        ratings: 4.9,
        numOfReviews: 92,
        isFeatured: true,
        specifications: [
          { key: 'Phone Output', value: '15W MagSafe' },
          { key: 'Watch & Buds', value: 'Dual 5W Wireless' }
        ]
      },
      {
        name: 'AeroCharge 15W Qi Fast Wireless Charging Pad',
        price: 1999,
        discountPrice: 2499,
        description: 'Ultra-thin aluminum Qi wireless pad with intelligent temperature management and anti-slip silicone ring.',
        category: catWireless._id,
        stock: 80,
        images: [{ url: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=600&auto=format&fit=crop', public_id: 'img12' }],
        variants: [{ color: 'Midnight Black', stock: 50 }, { color: 'Silver', stock: 30 }],
        brand: 'Anker Tech',
        ratings: 4.7,
        numOfReviews: 83,
        isFeatured: false,
        specifications: [
          { key: 'Max Speed', value: '15W Qi Certified' },
          { key: 'Thickness', value: '5.5mm' }
        ]
      },
      {
        name: 'UltraSpeed 128GB Dual Type-C & USB 3.2 OTG Drive',
        price: 2499,
        discountPrice: 2999,
        description: 'High-speed dual-interface flash drive with USB-C and USB-A for seamless phone, tablet, and PC transfers.',
        category: catUsb._id,
        stock: 120,
        images: [{ url: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=600&auto=format&fit=crop', public_id: 'img13' }],
        variants: [{ color: 'Brushed Metal', stock: 120 }],
        brand: 'SanDisk Tech',
        ratings: 4.9,
        numOfReviews: 240,
        isFeatured: true,
        specifications: [
          { key: 'Capacity', value: '128GB High-Speed' },
          { key: 'Read Speed', value: 'Up to 400MB/s' }
        ]
      },
      {
        name: 'TitanVault 64GB Metal Waterproof USB 3.0 Drive',
        price: 1499,
        discountPrice: 1799,
        description: 'Rugged unibody zinc-alloy USB drive that is waterproof, dustproof, and shock-resistant with key ring loop.',
        category: catUsb._id,
        stock: 90,
        images: [{ url: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?q=80&w=600&auto=format&fit=crop', public_id: 'img14' }],
        variants: [{ color: 'Silver Steel', stock: 90 }],
        brand: 'Kingston Pro',
        ratings: 4.8,
        numOfReviews: 110,
        isFeatured: false,
        specifications: [
          { key: 'Capacity', value: '64GB Flash Storage' },
          { key: 'Durability', value: 'Waterproof Zinc Alloy' }
        ]
      },
      {
        name: '10,000mAh MagSafe Magnetic Power Bank',
        price: 3499,
        discountPrice: 3999,
        description: 'Ultra-thin wireless magnetic power bank with strong snap-on magnets and 20W PD Type-C fast wired charging.',
        category: catPowerBanks._id,
        stock: 30,
        images: [{ url: 'https://images.unsplash.com/photo-1610945400287-34758564e9a3?q=80&w=600&auto=format&fit=crop', public_id: 'img5' }],
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
        name: '20,000mAh 65W Laptop Power Bank',
        price: 5499,
        discountPrice: 6200,
        description: 'High capacity power bank capable of charging MacBooks, Dell XPS, and fast charging up to 3 devices simultaneously.',
        category: catPowerBanks._id,
        stock: 22,
        images: [{ url: 'https://images.unsplash.com/photo-1609592424361-9c8699745e14?q=80&w=600&auto=format&fit=crop', public_id: 'img6' }],
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
      {
        name: 'Type-C to Lightning Braided Cable (2m)',
        price: 999,
        discountPrice: 1299,
        description: 'MFi-certified durable nylon braided fast charging cable tested for 30,000+ bends.',
        category: catCables._id,
        stock: 200,
        images: [{ url: 'https://images.unsplash.com/photo-1584006682522-dc17d6c0d06c?q=80&w=600&auto=format&fit=crop', public_id: 'img7' }],
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
        name: '100W 5A E-Marker USB-C to USB-C Cable',
        price: 1199,
        discountPrice: 1499,
        description: 'Heavy duty 100W USB-C cable with LED digital power display meter in zinc-alloy housing.',
        category: catCables._id,
        stock: 75,
        images: [{ url: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?q=80&w=600&auto=format&fit=crop', public_id: 'img8' }],
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

    await Product.insertMany(products);

    // 3. Seed Shops Directory
    const shopsJsonPath = path.join(__dirname, 'data/shops.json');
    if (fs.existsSync(shopsJsonPath)) {
      const shopsData = JSON.parse(fs.readFileSync(shopsJsonPath, 'utf8'));
      const formattedShops = shopsData.map(s => ({
        shopId: s.id,
        name: s.name,
        area: s.area,
        category: s.category,
        categoryGroup: s.categoryGroup,
        phone: s.phone,
        phoneDisplay: s.phoneDisplay,
        phones: s.phones,
        whatsapp: s.whatsapp,
        address: s.address,
        latitude: s.latitude,
        longitude: s.longitude,
        hasExactCoordinates: s.hasExactCoordinates,
        googleMapsUrl: s.googleMapsUrl,
        features: s.features,
        rating: s.rating,
        reviewCount: s.reviewCount,
        verified: s.verified,
        status: 'active'
      }));
      await Shop.insertMany(formattedShops);
      console.log(`Seeded ${formattedShops.length} shops into database!`);
    }

    console.log('Products, Categories & Shops Successfully Seeded into Database!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

importData();
