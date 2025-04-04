const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET all products with sorting and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      sort = 'name', 
      order = 'asc', 
      category, 
      price_gte, 
      price_lte 
    } = req.query;

    // Build the query object for filtering
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (price_gte || price_lte) {
      query.price = {};
      if (price_gte) query.price.$gte = Number(price_gte);
      if (price_lte) query.price.$lte = Number(price_lte);
    }

    // Build the sort options
    const sortOptions = {};
    if (['name', 'price', 'stock', 'category'].includes(sort)) {
      sortOptions[sort] = order === 'desc' ? -1 : 1;
    }

    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new product
router.post('/', async (req, res) => {
  const { name, price, stock, category } = req.body;

  try {
    const product = new Product({ name, price, stock, category });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a product
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a product
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product.toObject());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;