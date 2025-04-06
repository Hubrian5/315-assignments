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

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all orders with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      _id, 
      productName, 
      deliveryDate, 
      sort, 
      order 
    } = req.query;

    // Build the query object
    const query = {};
    
    // Filter by order ID (exact match)
    if (_id) {
      query._id = _id;
    }
    
    // Filter by product name (case-insensitive partial match)
    if (productName) {
      query['productId.name'] = { $regex: productName, $options: 'i' };
    }
    
    // Filter by delivery date (whole day range)
    if (deliveryDate) {
      const startDate = new Date(deliveryDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(deliveryDate);
      endDate.setHours(23, 59, 59, 999);
      
      query.deliveryDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Build sort options
    const sortOptions = {};
    if (sort && ['quantity', 'deliveryDate'].includes(sort)) {
      sortOptions[sort] = order === 'desc' ? -1 : 1;
    }

    // Execute query with population and sorting
    const orders = await Order.find(query)
      .populate('productId')
      .sort(sortOptions);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;