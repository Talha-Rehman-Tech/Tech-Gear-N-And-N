const express = require('express');
const router = express.Router();
const { getCategories, getCategoryBySlug, createCategory } = require('../controllers/categoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router.route('/:slug')
  .get(getCategoryBySlug);

module.exports = router;
