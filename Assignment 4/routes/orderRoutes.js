const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const router = express.Router();

// POST a new order
router.post('/', async (req, res) => {
  const { productId, quantity, emailId, deliveryDate } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const order = new Order({ productId, quantity, emailId, deliveryDate });
    await order.save();

    // Update product stock
    product.stock -= quantity;
    await product.save();

    console.log('Order placed successfully:', order);
    res.status(201).json(order);
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 
router.get('/', async (req, res) => {
  try {
    const { 
      _id, 
      productName, 
      deliveryDate, 
      sort, 
      order 
    } = req.query;

    const query = {};
    if (_id) query._id = _id;
    if (productName) query['productId.name'] = productName;
    if (deliveryDate) {
      const start = new Date(deliveryDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(deliveryDate);
      end.setHours(23, 59, 59, 999);
      query.deliveryDate = { $gte: start, $lte: end };
    }

    const sortOptions = {};
    if (sort && ['quantity', 'deliveryDate'].includes(sort)) {
      sortOptions[sort] = order === 'desc' ? -1 : 1;
    }

    const orders = await Order.find(query)
      .populate('productId')
      .sort(sortOptions);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;