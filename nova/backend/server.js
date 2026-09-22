require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Fail early with a clear message if required settings are missing
['MONGODB_URI', 'JWT_SECRET'].forEach((name) => {
  if (!process.env[name]) {
    console.error(`Missing environment variable: ${name}. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
});

// CORS: only the frontend origin(s) listed in CLIENT_URL may call this API from a browser
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173' || '*')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''));

app.use(
  cors({
    origin(origin, callback) {
      // No origin = tools like Postman/curl or same-origin requests
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      const error = new Error(`Origin ${origin} is not allowed by CORS`);
      error.status = 403;
      callback(error);
    },
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`NOVA API running on port ${PORT}`));
});
