const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

// Parse incoming JSON
app.use(bodyParser.json());

// Serve static files
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images')));


// CORS setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


// Routes
app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

// Global error handler
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
     console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res
  .status(typeof error.code === 'number' ? error.code : 500)
  .json({ message: error.message || 'An unknown error occurred!' });

})

// MongoDB connection string with environment variables
const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb+srv://${process.env.DB_USER || 'your_username'}:${process.env.DB_PASSWORD || 'your_password'}@cluster0.jvdrm4l.mongodb.net/${process.env.DB_NAME || 'your_database'}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(5000, () => {
      console.log('🚀 Backend running on http://localhost:5000');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    console.log('Please check your MongoDB credentials in the .env file or nodemon.json');
  });
