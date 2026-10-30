const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Required false so guests can also order if needed in future
  },
  shippingInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    country: { type: String, default: 'Pakistan' }
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      variant: {
        color: String
      }
    }
  ],
  paymentInfo: {
    method: {
      type: String,
      enum: ['COD', 'Card', 'BankTransfer'],
      default: 'COD'
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending'
    },
    transactionId: String
  },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  deliveredAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
