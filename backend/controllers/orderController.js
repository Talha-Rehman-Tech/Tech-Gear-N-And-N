const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// In-memory fallback if DB is not connected
let inMemoryOrders = [
  {
    _id: 'ord_1001',
    user: 'usr_default',
    shippingInfo: {
      name: 'Talha Rehman',
      phone: '+92 300 1234567',
      address: '123 Tech Street, Gulberg III',
      city: 'Lahore',
      postalCode: '54000',
      country: 'Pakistan'
    },
    orderItems: [
      {
        name: '65W GaN Fast Charger Ultra Pro',
        quantity: 1,
        price: 2999,
        image: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?q=80&w=600&auto=format&fit=crop',
        product: '66e1001a1b2c3d4e5f600001',
        variant: { color: 'White' }
      },
      {
        name: 'TechGear Pro AirBuds ANC',
        quantity: 1,
        price: 4499,
        image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=600&auto=format&fit=crop',
        product: '66e1001a1b2c3d4e5f600003',
        variant: { color: 'White' }
      }
    ],
    paymentInfo: { method: 'COD', status: 'Pending' },
    itemsPrice: 7498,
    shippingPrice: 0,
    totalPrice: 7498,
    orderStatus: 'Delivered',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingInfo,
      paymentInfo
    } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    if (!shippingInfo || !shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      return res.status(400).json({ message: 'Please provide complete shipping information (name, phone, address, city)' });
    }

    const { defaultProducts } = require('./productController');

    if (mongoose.connection.readyState === 1) {
      let verifiedItemsPrice = 0;
      const cleanedItems = [];

      for (const item of orderItems) {
        const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
        const prodId = item.product || item.id;
        let itemPrice = Number(item.price) || 0;
        let itemName = item.name || 'Accessory Item';
        let itemImage = item.image || 'https://via.placeholder.com/600';
        let finalProdId = new mongoose.Types.ObjectId('66e1001a1b2c3d4e5f600001');

        if (mongoose.Types.ObjectId.isValid(prodId)) {
          const dbProduct = await Product.findById(prodId);
          if (dbProduct) {
            itemPrice = dbProduct.price;
            itemName = dbProduct.name;
            itemImage = dbProduct.images?.[0]?.url || itemImage;
            finalProdId = dbProduct._id;
            // Deduct stock if available
            if (dbProduct.stock >= qty) {
              dbProduct.stock -= qty;
              await dbProduct.save();
            }
          }
        } else {
          const fallbackProd = defaultProducts.find(p => p._id === prodId || p.name === item.name);
          if (fallbackProd) {
            itemPrice = fallbackProd.price;
            itemName = fallbackProd.name;
            itemImage = fallbackProd.images?.[0]?.url || itemImage;
          }
        }

        verifiedItemsPrice += itemPrice * qty;
        cleanedItems.push({
          name: itemName,
          quantity: qty,
          image: itemImage,
          price: itemPrice,
          product: finalProdId,
          variant: item.variant || { color: item.color || 'Default' }
        });
      }

      const verifiedShippingPrice = verifiedItemsPrice > 2000 ? 0 : 150;
      const verifiedTotalPrice = verifiedItemsPrice + verifiedShippingPrice;

      const order = new Order({
        user: req.user._id,
        shippingInfo,
        orderItems: cleanedItems,
        paymentInfo: paymentInfo || { method: 'COD', status: 'Pending' },
        itemsPrice: verifiedItemsPrice,
        shippingPrice: verifiedShippingPrice,
        totalPrice: verifiedTotalPrice,
        orderStatus: 'Processing'
      });

      const createdOrder = await order.save();
      return res.status(201).json(createdOrder);
    } else {
      // In-memory fallback
      let verifiedItemsPrice = 0;
      const cleanedItems = orderItems.map(item => {
        const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
        const fallbackProd = defaultProducts.find(p => p._id === (item.product || item.id) || p.name === item.name);
        const itemPrice = fallbackProd ? fallbackProd.price : (Number(item.price) || 999);
        if (fallbackProd && fallbackProd.stock >= qty) {
          fallbackProd.stock -= qty;
        }
        verifiedItemsPrice += itemPrice * qty;
        return {
          name: fallbackProd ? fallbackProd.name : item.name,
          quantity: qty,
          image: fallbackProd?.images?.[0]?.url || item.image || 'https://via.placeholder.com/600',
          price: itemPrice,
          product: item.product || item.id || 'prod_fallback',
          variant: item.variant || { color: item.color || 'Default' }
        };
      });

      const verifiedShippingPrice = verifiedItemsPrice > 2000 ? 0 : 150;
      const verifiedTotalPrice = verifiedItemsPrice + verifiedShippingPrice;

      const newOrder = {
        _id: 'ord_' + Date.now(),
        user: req.user._id,
        shippingInfo,
        orderItems: cleanedItems,
        paymentInfo: paymentInfo || { method: 'COD', status: 'Pending' },
        itemsPrice: verifiedItemsPrice,
        shippingPrice: verifiedShippingPrice,
        totalPrice: verifiedTotalPrice,
        orderStatus: 'Processing',
        createdAt: new Date()
      };
      inMemoryOrders.unshift(newOrder);
      return res.status(201).json(newOrder);
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const orders = inMemoryOrders.filter(o => o.user.toString() === req.user._id.toString() || o.user === 'usr_default');
      return res.json(orders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      return res.json(inMemoryOrders);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Processing', 'Shipped', 'In Transit', 'Delivered', 'Cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid order status. Permitted statuses: ${allowedStatuses.join(', ')}` 
      });
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.orderStatus = status;
        if (status === 'Delivered') {
          order.deliveredAt = Date.now();
          if (order.paymentInfo) {
            order.paymentInfo.status = 'Completed';
          }
        }
        const updated = await order.save();
        return res.json(updated);
      }
    }

    const order = inMemoryOrders.find(o => o._id === req.params.id);
    if (order) {
      order.orderStatus = status;
      return res.json(order);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
