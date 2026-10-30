const express = require('express');
const router = express.Router();
const {
  getShopsDirectory,
  getShopById,
  getShopSettings,
  updateShopSettings
} = require('../controllers/shopController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Store settings endpoints
router.get('/settings', getShopSettings);
router.post('/settings', protect, admin, updateShopSettings);

// Directory endpoints
router.route('/')
  .get(getShopsDirectory)
  .post(protect, admin, updateShopSettings);

router.get('/:id', getShopById);

module.exports = router;
