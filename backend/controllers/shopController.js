const Shop = require('../models/Shop');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load fallback shops data from JSON
let fallbackShops = [];
try {
  const jsonPath = path.join(__dirname, '../data/shops.json');
  if (fs.existsSync(jsonPath)) {
    fallbackShops = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }
} catch (e) {
  console.warn('Could not load fallback shops.json:', e.message);
}

// In-memory fallback shop settings (legacy)
let inMemoryShopSettings = {
  shopName: 'TechGear Official',
  ownerName: 'Talha Rehman',
  email: 'contact@techgear.com',
  phone: '+92 300 0000000',
  address: 'Shop #12, IT Tower, Gulberg III, Lahore',
  description: 'Official flagship store for premium mobile accessories and fast chargers.',
  logo: 'https://images.unsplash.com/photo-1628102491629-77858ab5721d?q=80&w=400&auto=format&fit=crop',
  isVerified: true,
  status: 'active'
};

// @desc    Get all shops directory with filtering
// @route   GET /api/shops (or /api/shop)
// @access  Public
const getShopsDirectory = async (req, res) => {
  try {
    // If client is asking specifically for store profile settings (legacy /api/shop without search params)
    if (req.query.type === 'settings' || (req.path === '/' && req.baseUrl === '/api/shop' && Object.keys(req.query).length === 0)) {
      return getShopSettings(req, res);
    }

    const { search, q, area, category, group, hasWhatsApp, verified, limit, page = 1 } = req.query;
    const searchQuery = (search || q || '').trim().toLowerCase();

    let shopsList = [];

    // Attempt MongoDB fetch if connected
    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (area && area.toLowerCase() !== 'all') {
        filter.area = new RegExp(`^${area}$`, 'i');
      }
      if (group && group !== 'all') {
        filter.categoryGroup = group;
      }
      if (hasWhatsApp === 'true') {
        filter.whatsapp = { $ne: '' };
      }
      if (verified === 'true') {
        filter.verified = true;
      }
      if (searchQuery) {
        filter.$or = [
          { name: new RegExp(searchQuery, 'i') },
          { area: new RegExp(searchQuery, 'i') },
          { address: new RegExp(searchQuery, 'i') },
          { phone: new RegExp(searchQuery, 'i') }
        ];
      }

      shopsList = await Shop.find(filter).lean();
    }

    // Fallback to local JSON if MongoDB returned no directory records
    if (!shopsList || shopsList.length === 0) {
      let filtered = [...fallbackShops];

      if (area && area.toLowerCase() !== 'all') {
        filtered = filtered.filter(s => s.area.toLowerCase() === area.toLowerCase());
      }
      if (group && group !== 'all') {
        filtered = filtered.filter(s => s.categoryGroup === group);
      }
      if (hasWhatsApp === 'true') {
        filtered = filtered.filter(s => Boolean(s.whatsapp));
      }
      if (verified === 'true') {
        filtered = filtered.filter(s => s.verified);
      }
      if (searchQuery) {
        filtered = filtered.filter(s =>
          s.name.toLowerCase().includes(searchQuery) ||
          s.area.toLowerCase().includes(searchQuery) ||
          s.address.toLowerCase().includes(searchQuery) ||
          s.phone.includes(searchQuery)
        );
      }

      shopsList = filtered;
    }

    const total = shopsList.length;
    const areas = Array.from(new Set(fallbackShops.map(s => s.area))).sort();

    let paginated = shopsList;
    const numLimit = parseInt(limit, 10);
    const numPage = parseInt(page, 10);
    if (!isNaN(numLimit) && numLimit > 0) {
      const start = (numPage - 1) * numLimit;
      paginated = shopsList.slice(start, start + numLimit);
    }

    return res.json({
      success: true,
      total,
      page: numPage,
      limit: numLimit || total,
      shops: paginated,
      areas
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single shop by ID
// @route   GET /api/shops/:id
// @access  Public
const getShopById = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === 'settings') {
      return getShopSettings(req, res);
    }

    // Look in MongoDB
    if (mongoose.connection.readyState === 1) {
      const query = mongoose.Types.ObjectId.isValid(id)
        ? { $or: [{ _id: id }, { shopId: id }] }
        : { shopId: id };
      const shop = await Shop.findOne(query).lean();
      if (shop) {
        return res.json({ success: true, shop });
      }
    }

    // Look in fallback JSON
    const shop = fallbackShops.find(s => s.id === id);
    if (shop) {
      const nearby = fallbackShops.filter(s => s.area === shop.area && s.id !== shop.id).slice(0, 4);
      return res.json({ success: true, shop, nearby });
    }

    return res.status(404).json({ success: false, message: 'Shop not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get shop settings (legacy)
// @route   GET /api/shop/settings
// @access  Public
const getShopSettings = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const shop = await Shop.findOne({ shopName: { $exists: true, $ne: null } });
      if (shop) {
        return res.json(shop);
      }
    }
    return res.json(inMemoryShopSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update or create shop settings
// @route   POST /api/shop
// @access  Private/Admin
const updateShopSettings = async (req, res) => {
  try {
    const { shopName, ownerName, email, phone, address, description, logo } = req.body;

    if (!shopName || !ownerName || !email || !phone || !address || !description) {
      return res.status(400).json({ message: 'Please provide all required shop details.' });
    }

    if (mongoose.connection.readyState === 1) {
      let shop = await Shop.findOne({ shopName: { $exists: true, $ne: null } });
      if (shop) {
        shop.shopName = shopName;
        shop.name = shopName;
        shop.ownerName = ownerName;
        shop.email = email;
        shop.phone = phone;
        shop.address = address;
        shop.description = description;
        if (logo) shop.logo = logo;
        await shop.save();
        return res.json(shop);
      } else {
        shop = await Shop.create({
          shopId: 'techgear-official',
          name: shopName,
          shopName,
          ownerName,
          email,
          phone,
          address,
          description,
          logo: logo || 'default-logo.png',
          user: req.user?._id,
          verified: true,
          status: 'active'
        });
        return res.status(201).json(shop);
      }
    }

    inMemoryShopSettings = {
      ...inMemoryShopSettings,
      shopName,
      ownerName,
      email,
      phone,
      address,
      description,
      logo: logo || inMemoryShopSettings.logo
    };

    return res.json(inMemoryShopSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getShopsDirectory,
  getShopById,
  getShopSettings,
  updateShopSettings
};
