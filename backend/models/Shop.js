const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  shopId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a shop name'],
    trim: true,
  },
  area: {
    type: String,
    default: 'Faisalabad',
    trim: true,
  },
  category: {
    type: String,
    default: 'Cell Phone Store',
    trim: true,
  },
  categoryGroup: {
    type: String,
    enum: ['store', 'accessories', 'repair', 'computers', 'wholesale', 'electronics', 'other'],
    default: 'store',
  },
  phone: {
    type: String,
    default: '',
  },
  phoneDisplay: {
    type: String,
    default: '',
  },
  phones: {
    type: [String],
    default: [],
  },
  whatsapp: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  hasExactCoordinates: {
    type: Boolean,
    default: true,
  },
  googleMapsUrl: {
    type: String,
    default: '',
  },
  features: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  reviewCount: {
    type: Number,
    default: 20,
  },
  verified: {
    type: Boolean,
    default: true,
  },

  // Legacy store profile / admin settings fields (backward compatibility)
  shopName: {
    type: String,
    trim: true,
    sparse: true,
  },
  ownerName: {
    type: String,
  },
  email: {
    type: String,
  },
  description: {
    type: String,
  },
  logo: {
    type: String,
    default: 'no-photo.jpg',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Shop', shopSchema);
