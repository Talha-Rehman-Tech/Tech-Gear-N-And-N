const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// Rich default fallback products in case MongoDB is offline or empty
let defaultProducts = [
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
  {
    _id: '66e1001a1b2c3d4e5f600003',
    name: 'TechGear Pro AirBuds ANC',
    price: 4499,
    discountPrice: 5499,
    description: 'Active Noise Cancelling TWS earbuds with ultra-low latency game mode, punchy bass, and 36-hour total battery life with case.',
    category: { _id: 'cat_audio', name: 'Audio & TWS', slug: 'audio' },
    stock: 100,
    images: [{ url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=600&auto=format&fit=crop', public_id: 'img3' }],
    variants: [{ color: 'White', stock: 60 }, { color: 'Midnight Black', stock: 40 }],
    brand: 'TechGear',
    ratings: 4.7,
    numOfReviews: 210,
    isFeatured: true,
    specifications: [
      { key: 'Noise Cancellation', value: '-35dB Active ANC' },
      { key: 'Battery Life', value: '36 Hours' },
      { key: 'Water Resistance', value: 'IPX5' }
    ]
  },
  {
    _id: '66e1001a1b2c3d4e5f600004',
    name: 'Studio Wireless Over-Ear Headphones',
    price: 6999,
    discountPrice: 8499,
    description: 'High-Fidelity studio sound with 40mm titanium drivers, plush memory foam ear cushions, and 50-hour playback.',
    category: { _id: 'cat_audio', name: 'Audio & TWS', slug: 'audio' },
    stock: 15,
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', public_id: 'img4' }],
    variants: [{ color: 'Silver', stock: 8 }, { color: 'Black', stock: 7 }],
    brand: 'SoundWave',
    ratings: 4.9,
    numOfReviews: 76,
    isFeatured: false,
    specifications: [
      { key: 'Driver Size', value: '40mm Dynamic Drivers' },
      { key: 'Battery', value: '50h Playtime' }
    ]
  },
  {
    _id: '66e1001a1b2c3d4e5f600005',
    name: '10,000mAh MagSafe Magnetic Power Bank',
    price: 3499,
    discountPrice: 3999,
    description: 'Ultra-thin wireless magnetic power bank with strong snap-on magnets and 20W PD Type-C fast wired charging.',
    category: { _id: 'cat_powerbanks', name: 'Power Banks', slug: 'power-banks' },
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
    _id: '66e1001a1b2c3d4e5f600006',
    name: '20,000mAh 65W Laptop Power Bank',
    price: 5499,
    discountPrice: 6200,
    description: 'High capacity power bank capable of charging MacBooks, Dell XPS, and fast charging up to 3 devices simultaneously.',
    category: { _id: 'cat_powerbanks', name: 'Power Banks', slug: 'power-banks' },
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
    _id: '66e1001a1b2c3d4e5f600007',
    name: 'Type-C to Lightning Braided Cable (2m)',
    price: 999,
    discountPrice: 1299,
    description: 'MFi-certified durable nylon braided fast charging cable tested for 30,000+ bends.',
    category: { _id: 'cat_cables', name: 'Durable Cables', slug: 'cables' },
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
    _id: '66e1001a1b2c3d4e5f600008',
    name: '100W 5A E-Marker USB-C to USB-C Cable',
    price: 1199,
    discountPrice: 1499,
    description: 'Heavy duty 100W USB-C cable with LED digital power display meter in zinc-alloy housing.',
    category: { _id: 'cat_cables', name: 'Durable Cables', slug: 'cables' },
    stock: 75,
    images: [{ url: 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?q=80&w=600&auto=format&fit=crop', public_id: 'img8' }],
    variants: [{ color: 'Gray', stock: 75 }],
    brand: 'TechGear',
    ratings: 4.8,
    numOfReviews: 95,
    isFeatured: false,
    specifications: [
      { key: 'Power Display', value: 'Real-time Wattage LED' },
      { key: 'Charging Speed', value: '100W (20V/5A)' }
    ]
  }
];

// Helper to escape user input for safe regular expressions (Prevents ReDoS)
const escapeRegex = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Normalize category slugs and aliases
const normalizeCategorySlug = (slug) => {
  if (!slug) return '';
  const s = slug.toLowerCase().trim();
  if (s === 'chargers' || s === 'fast-chargers') return 'fast-chargers';
  if (s === 'powerbanks' || s === 'power-banks') return 'power-banks';
  if (s === 'audio') return 'audio';
  if (s === 'cables') return 'cables';
  return s;
};

// @desc    Fetch all products with rich filters & sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, inStock, brand, isFeatured, sortBy, sort } = req.query;
    const sortParam = sortBy || sort;

    const filterFallback = () => {
      let filtered = [...defaultProducts];

      if (keyword && keyword.trim()) {
        const kw = keyword.toLowerCase().trim();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(kw) || 
          (p.description && p.description.toLowerCase().includes(kw)) ||
          (p.brand && p.brand.toLowerCase().includes(kw))
        );
      }

      if (category && category !== 'all' && category !== 'new') {
        const normalizedSlug = normalizeCategorySlug(category);
        filtered = filtered.filter(p => {
          const pSlug = p.category?.slug || '';
          return pSlug === normalizedSlug || p.category?.name?.toLowerCase().includes(category.toLowerCase());
        });
      }

      if (minPrice && !isNaN(Number(minPrice))) {
        filtered = filtered.filter(p => p.price >= Number(minPrice));
      }

      if (maxPrice && !isNaN(Number(maxPrice))) {
        filtered = filtered.filter(p => p.price <= Number(maxPrice));
      }

      if (inStock === 'true' || inStock === true) {
        filtered = filtered.filter(p => p.stock > 0);
      }

      if (brand && brand !== 'all') {
        filtered = filtered.filter(p => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
      }

      if (isFeatured === 'true' || isFeatured === true) {
        filtered = filtered.filter(p => p.isFeatured);
      }

      if (sortParam === 'price-asc' || sortParam === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortParam === 'price-desc' || sortParam === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortParam === 'rating' || sortParam === 'top-rated') {
        filtered.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
      }

      return filtered;
    };

    if (mongoose.connection.readyState !== 1) {
      return res.json(filterFallback());
    }

    let query = {};

    // 1. Search keyword (name or description) safely escaped
    if (keyword && keyword.trim()) {
      const safeKeyword = escapeRegex(keyword.trim());
      query.$or = [
        { name: { $regex: safeKeyword, $options: 'i' } },
        { description: { $regex: safeKeyword, $options: 'i' } },
        { brand: { $regex: safeKeyword, $options: 'i' } }
      ];
    }

    // 2. Category filter
    if (category && category !== 'all' && category !== 'new') {
      const normalizedSlug = normalizeCategorySlug(category);
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const safeCat = escapeRegex(category.trim());
        const foundCategory = await Category.findOne({
          $or: [{ slug: normalizedSlug }, { name: new RegExp(`^${safeCat}$`, 'i') }]
        });
        if (foundCategory) {
          query.category = foundCategory._id;
        }
      }
    }

    // 3. Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // 4. In-Stock filter
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // 5. Brand filter safely escaped
    if (brand && brand !== 'all') {
      const safeBrand = escapeRegex(brand.trim());
      query.brand = { $regex: new RegExp(`^${safeBrand}$`, 'i') };
    }

    // 6. Featured filter
    if (isFeatured === 'true' || isFeatured === true) {
      query.isFeatured = true;
    }

    // 7. Sort options
    let sortOption = { createdAt: -1 };
    if (sortParam === 'price-asc' || sortParam === 'price-low') {
      sortOption = { price: 1 };
    } else if (sortParam === 'price-desc' || sortParam === 'price-high') {
      sortOption = { price: -1 };
    } else if (sortParam === 'rating' || sortParam === 'top-rated') {
      sortOption = { ratings: -1, numOfReviews: -1 };
    } else if (sortParam === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sortParam === 'recommended') {
      sortOption = { isFeatured: -1, ratings: -1, createdAt: -1 };
    }

    let products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption);

    if (!products || products.length === 0) {
      // Only fallback if the database has zero products in total
      const totalCount = await Product.countDocuments();
      if (totalCount === 0) {
        return res.json(filterFallback());
      }
      return res.json([]);
    }

    res.json(products);
  } catch (error) {
    res.json(defaultProducts);
  }
};


// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findById(id).populate('category', 'name slug');
      if (product) {
        return res.json(product);
      }
    }

    // Fallback matching
    const fallback = defaultProducts.find(p => p._id === id || p._id.toString() === id.toString() || p.name.toLowerCase().includes(id.toLowerCase()));
    if (fallback) {
      return res.json(fallback);
    }

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    const fallback = defaultProducts.find(p => p._id === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      discountPrice,
      description,
      category,
      stock,
      images,
      brand,
      specifications,
      variants,
      isFeatured
    } = req.body;

    if (mongoose.connection.readyState === 1) {
      let categoryId = category;
      if (category && !mongoose.Types.ObjectId.isValid(category)) {
        const foundCat = await Category.findOne({
          $or: [{ slug: category }, { name: category }]
        });
        if (foundCat) {
          categoryId = foundCat._id;
        } else {
          const newCat = await Category.create({ name: category });
          categoryId = newCat._id;
        }
      }

      const product = new Product({
        name: name || 'Untitled Product',
        price: price ? Number(price) : 0,
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        description: description || 'No description provided.',
        category: categoryId,
        stock: stock ? Number(stock) : 0,
        images: images && images.length > 0 ? images : [{ url: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=800&auto=format&fit=crop', public_id: 'default' }],
        brand: brand || 'Generic',
        specifications: specifications || [],
        variants: variants || [],
        isFeatured: isFeatured !== undefined ? isFeatured : true
      });

      const createdProduct = await product.save();
      return res.status(201).json(createdProduct);
    } else {
      // In-Memory Fallback
      const newProduct = {
        _id: 'prod_' + Date.now(),
        name: name || 'Untitled Product',
        price: price ? Number(price) : 0,
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        description: description || 'No description provided.',
        category: {
          _id: 'cat_' + Date.now(),
          name: typeof category === 'string' ? category : 'General',
          slug: typeof category === 'string' ? category : 'general'
        },
        stock: stock ? Number(stock) : 50,
        images: images && images.length > 0 ? images : [{ url: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=800&auto=format&fit=crop', public_id: 'default' }],
        brand: brand || 'TechGear',
        specifications: specifications || [],
        variants: variants || [],
        isFeatured: isFeatured !== undefined ? isFeatured : true,
        ratings: 5.0,
        numOfReviews: 1,
        createdAt: new Date()
      };
      defaultProducts.unshift(newProduct);
      return res.status(201).json(newProduct);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'price', 'discountPrice', 'description', 'category',
      'stock', 'images', 'brand', 'specifications', 'variants', 'isFeatured'
    ];

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      const product = await Product.findById(req.params.id);
      if (product) {
        allowedFields.forEach((field) => {
          if (req.body[field] !== undefined) {
            product[field] = req.body[field];
          }
        });
        const updatedProduct = await product.save();
        return res.json(updatedProduct);
      }
      return res.status(404).json({ message: 'Product not found' });
    }

    // In-memory fallback
    const product = defaultProducts.find(p => p._id === req.params.id);
    if (product) {
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          product[field] = req.body[field];
        }
      });
      return res.json(product);
    }

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      const product = await Product.findById(req.params.id);
      if (product) {
        await Product.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Product removed' });
      }
      return res.status(404).json({ message: 'Product not found' });
    }

    // In-memory fallback
    const index = defaultProducts.findIndex(p => p._id === req.params.id);
    if (index !== -1) {
      defaultProducts.splice(index, 1);
      return res.json({ message: 'Product removed' });
    }

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  defaultProducts
};
