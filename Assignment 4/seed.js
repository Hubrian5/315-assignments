const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Inserting 15 items into database

// Sample products data
const products = [
  { name: "Laptop", price: 1000, stock: 10, category: "Electronics" },
  { name: "Phone", price: 500, stock: 5, category: "Electronics" },
  { name: "Tablet", price: 300, stock: 0, category: "Electronics" },
  { name: "Headphones", price: 100, stock: 20, category: "Accessories" },
  { name: "Keyboard", price: 50, stock: 0, category: "Accessories" },
  { name: "Mouse", price: 30, stock: 15, category: "Accessories" },
  { name: "Monitor", price: 200, stock: 8, category: "Electronics" },
  { name: "Printer", price: 150, stock: 3, category: "Electronics" },
  { name: "Smartwatch", price: 250, stock: 0, category: "Electronics" },
  { name: "Camera", price: 600, stock: 7, category: "Electronics" },
  { name: "Speaker", price: 120, stock: 12, category: "Accessories" },
  { name: "External Hard Drive", price: 80, stock: 0, category: "Accessories" },
  { name: "USB Cable", price: 10, stock: 50, category: "Accessories" },
  { name: "Charger", price: 25, stock: 30, category: "Accessories" },
  { name: "Power Bank", price: 40, stock: 0, category: "Accessories" },
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Insert products into the database
const seedProducts = async () => {
  try {
    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(products); // Insert new products
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

// Run the script
connectDB().then(() => seedProducts());