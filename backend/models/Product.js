const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
  },
  discountPrice: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  stock: {
    type: Number,
    required: [true, 'Please provide product stock'],
    default: 0,
  },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ],
  specifications: [
    {
      key: String,
      value: String
    }
  ],
  boxContents: [String],
  variants: [
    {
      color: String,
      stock: Number
    }
  ],
  brand: {
    type: String,
    default: 'Generic',
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
