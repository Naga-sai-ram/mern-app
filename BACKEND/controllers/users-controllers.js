const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  try {
    console.log('📋 Fetching users from database...');
    const users = await User.find({}, '-password').populate('places');
    console.log(`📊 Found ${users.length} users in database`);
    
    const transformedUsers = users.map(user => {
      const userObj = user.toObject({ getters: true });
      let imageUrl = userObj.image;
      if (!imageUrl || !imageUrl.startsWith('http')) {
        imageUrl = process.env.DEFAULT_USER_IMAGE_URL || '';
      }
      return {
        ...userObj,
        image: imageUrl,
        placeCount: userObj.places ? userObj.places.length : 0
      };
    });
    
    console.log('✅ Sending users response:', transformedUsers.length);
    res.json({ users: transformedUsers });
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    next(new HttpError('Fetching users failed, please try again later.', 500));
  }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new HttpError('User exists already, please login instead.', 422));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file ? (req.file.path || req.file.url) : process.env.DEFAULT_USER_IMAGE_URL || '', // Cloudinary URL
      places: []
    });

    await createdUser.save();

    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY, // Use environment variable for secret key
      { expiresIn: '1h' }
    );

    let imageUrl = createdUser.image;
    if (!imageUrl || !imageUrl.startsWith('http')) {
      imageUrl = process.env.DEFAULT_USER_IMAGE_URL || '';
    }
    res.status(201).json({
      userId: createdUser.id,
      email: createdUser.email,
      image: imageUrl,
      token
    });
  } catch (err) {
    next(new HttpError('Signing up failed, please try again later.', 500));
  }
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new HttpError('Invalid credentials, could not log you in.', 403));
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return next(new HttpError('Invalid credentials, could not log you in.', 403));
    }

    const token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY, // Use environment variable for secret key
      { expiresIn: '1h' }
    );

    let imageUrl = existingUser.image;
    if (!imageUrl || !imageUrl.startsWith('http')) {
      imageUrl = process.env.DEFAULT_USER_IMAGE_URL || '';
    }
    res.json({
      userId: existingUser.id,
      email: existingUser.email,
      image: imageUrl,
      token
    });
  } catch (err) {
    next(new HttpError('Logging in failed, please try again later.', 500));
  }
};

module.exports = { getUsers, signup, login };
