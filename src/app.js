const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const postRoutes = require('./routes/postRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'blog-api',
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/posts', postRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
