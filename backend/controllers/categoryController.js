const Category = require('../models/Category');
const Product = require('../models/Product');

// Fallback categories list
const defaultCategories = [
  { _id: 'cat_chargers', name: 'Fast Chargers', slug: 'fast-chargers', description: 'Power up your devices with high-speed GaN chargers.' },
  { _id: 'cat_audio', name: 'Audio & TWS', slug: 'audio', description: 'Immersive sound quality with deep bass and active noise cancellation.' },
  { _id: 'cat_cables', name: 'Durable Cables', slug: 'cables', description: 'Tangle-free, braided cables designed for fast data transfer and charging.' },
  { _id: 'cat_powerbanks', name: 'Power Banks', slug: 'power-banks', description: 'High-capacity, magnetic, and ultra-portable battery packs.' }
];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.json(defaultCategories);
    }
    const categories = await Category.find({});
    if (categories && categories.length > 0) {
      const categoriesWithCount = await Promise.all(
        categories.map(async (cat) => {
          const count = await Product.countDocuments({ category: cat._id });
          return {
            ...cat.toObject(),
            productCount: count,
          };
        })
      );
      return res.json(categoriesWithCount);
    }
    res.json(defaultCategories);
  } catch (error) {
    res.json(defaultCategories);
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const mongoose = require('mongoose');
    
    if (mongoose.connection.readyState === 1) {
      const category = await Category.findOne({ 
        $or: [
          { slug: slug },
          { slug: slug === 'chargers' ? 'fast-chargers' : slug === 'powerbanks' ? 'power-banks' : slug }
        ]
      });

      if (category) {
        return res.json(category);
      }
    }

    const fallback = defaultCategories.find(c => c.slug === slug || (slug === 'chargers' && c.slug === 'fast-chargers') || (slug === 'powerbanks' && c.slug === 'power-banks'));
    if (fallback) {
      return res.json(fallback);
    }

    res.status(404).json({ message: 'Category not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description,
      image,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, getCategoryBySlug, createCategory, defaultCategories };
