// Populates a fresh database with a demo admin account, products and orders.
// Run with: npm run seed
// WARNING: this clears the existing Product, Order and User collections first.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const products = require('./products');
const { calculateTotals } = require('../utils/pricing');

const SAMPLE_CUSTOMERS = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '9876500001', address: '12 MG Road', city: 'Bengaluru', pincode: '560001' },
  { name: 'Priya Nair', email: 'priya.nair@example.com', phone: '9876500002', address: '45 Park Street', city: 'Kolkata', pincode: '700016' },
  { name: 'Rohan Mehta', email: 'rohan.mehta@example.com', phone: '9876500003', address: '9 FC Road', city: 'Pune', pincode: '411004' },
  { name: 'Ananya Iyer', email: 'ananya.iyer@example.com', phone: '9876500004', address: '78 Anna Salai', city: 'Chennai', pincode: '600002' },
  { name: 'Kabir Khan', email: 'kabir.khan@example.com', phone: '9876500005', address: '23 Sector 18', city: 'Noida', pincode: '201301' },
];
const STATUSES = ['Delivered', 'Delivered', 'Shipped', 'Processing', 'Pending', 'Delivered', 'Cancelled'];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };

const run = async () => {
  await connectDB();

  console.log('Clearing existing Product, Order and User collections...');
  await Promise.all([Product.deleteMany({}), Order.deleteMany({}), User.deleteMany({})]);

  console.log('Creating admin account...');
  await User.create({
    name: 'NOVA Admin',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@nova.com',
    password: process.env.SEED_ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
  });

  console.log(`Creating ${products.length} products...`);
  const createdProducts = await Product.insertMany(products);

  console.log('Creating sample orders (demo/seed data for the analytics dashboard)...');
  const orderDocs = [];
  for (let i = 0; i < 22; i += 1) {
    const itemCount = randomInt(1, 3);
    const chosen = [...createdProducts].sort(() => 0.5 - Math.random()).slice(0, itemCount);
    const items = chosen.map((product) => ({
      product: product._id, name: product.name, price: product.price, image: product.image,
      quantity: randomInt(1, 3),
    }));
    const totals = calculateTotals(items);
    const customer = SAMPLE_CUSTOMERS[randomInt(0, SAMPLE_CUSTOMERS.length - 1)];
    const createdAt = daysAgo(randomInt(0, 29));
    orderDocs.push({
      customer, items, ...totals,
      status: STATUSES[randomInt(0, STATUSES.length - 1)],
      createdAt, updatedAt: createdAt,
    });
  }
  await Order.insertMany(orderDocs);

  console.log('\nSeed complete:');
  console.log(`  Admin login  -> ${process.env.SEED_ADMIN_EMAIL || 'admin@nova.com'} / ${process.env.SEED_ADMIN_PASSWORD || 'Admin@123'}`);
  console.log(`  Products     -> ${createdProducts.length}`);
  console.log(`  Sample orders-> ${orderDocs.length} (demo data, not real orders)`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
