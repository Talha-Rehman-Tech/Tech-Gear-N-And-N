require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

// Connect to Database
connectDB();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shopRoutes = require('./routes/shopRoutes');

const app = express();

// Security & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) or listed origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy does not allow access from the specified Origin.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Body parser

// Data sanitization against NoSQL query injection (Express 5 safe)
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 1000, // Allow 1000 requests per 10 mins for development
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Prevent HTTP param pollution
app.use(hpp());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/shops', shopRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Mobile Accessories E-commerce API is running...',
    status: 'online',
    database: 'MongoDB Docker Instance',
    endpoints: ['/api/products', '/api/categories', '/api/users', '/api/orders']
  });
});

// Error Handler Middlewares (Must be at the end)
app.use(notFound);
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
