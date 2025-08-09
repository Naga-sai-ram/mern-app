const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controller');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// 🔍 GET all places
router.get('/', placesControllers.getAllPlaces);

// 🔍 GET place by ID
router.get('/:pid', placesControllers.getPlaceById);

// 🔍 GET places by user ID
router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.use(checkAuth);

// 📌 POST new place
router.post(
  '/',
  fileUpload.single('image'), // Handle file upload
  [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('description').isLength({ min: 5 }).withMessage('Description must be at least 5 characters long'),
    check('address').not().isEmpty().withMessage('Address is required')
  ],
  placesControllers.createPlace
);

// 🔄 PATCH (update) place
router.patch(
  '/:pid',
  [
    check('title').not().isEmpty().withMessage('Title cannot be empty'),
    check('description').isLength({ min: 5 }).withMessage('Description must be at least 5 characters')
  ],
  placesControllers.updatePlace
);

// ❌ DELETE place
router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
