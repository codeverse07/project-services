const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/AppError');
const routes = require('./routes/v1');
const errorHandler = require('./middlewares/errorHandler');
const { globalLimiter } = require('./middlewares/rateLimit');

const app = express();

// Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
app.use('/api', globalLimiter);
app.use(cors({
    origin: 'http://localhost:3000', // Adjust for frontend
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Serving static files
app.use('/public', express.static('public'));

// Routes
app.use('/api/v1', routes);

// 404 Handler
// 404 Handler - Disabled for debugging
// app.all('*', (req, res, next) => {
//     next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// Global Error Handler
app.use(errorHandler);

module.exports = app;
