const { v4: uuidv4 } = require('uuid');

const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose'); // Import mongoose for MongoDB interaction

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user'); // Assuming you have a User model

// ✅ GET /api/places/
const getAllPlaces = async (req, res, next) => {
  let places;
  try {
    places = await Place.find();
  } catch (err) {
    const error = new HttpError('Fetching places failed, please try again later.', 500);
    return next(error);
  }

  // Transform places to handle both old and new image path formats
  const transformedPlaces = places.map(place => {
    const placeObj = place.toObject({ getters: true });
    
    // If the image path contains the full system path, extract just the filename
    if (placeObj.image && (placeObj.image.includes('uploads\\images\\') || placeObj.image.includes('uploads/images/'))) {
      placeObj.image = placeObj.image.split(/[\\\/]/).pop(); // Get just the filename
    }
    
    // Construct full image URL
    if (placeObj.image) {
      placeObj.image = `${req.protocol}://${req.get('host')}/uploads/images/${placeObj.image}`;
    }
    
    return placeObj;
  });

  res.json({ places: transformedPlaces });
};

// ✅ GET /api/places/:pid
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a place.', 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find a place for the provided id.', 404);
    return next(error);
  }

  const placeObj = place.toObject({ getters: true });
  
  // If the image path contains the full system path, extract just the filename
  if (placeObj.image && (placeObj.image.includes('uploads\\images\\') || placeObj.image.includes('uploads/images/'))) {
    placeObj.image = placeObj.image.split(/[\\\/]/).pop(); // Get just the filename
  }

  // Construct full image URL
  if (placeObj.image) {
    placeObj.image = `${req.protocol}://${req.get('host')}/uploads/images/${placeObj.image}`;
  }

  res.json({ place: placeObj });
};

// ✅ GET /api/places/user/:uid
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  //let places;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places'); // Populate places field
  } catch (err) {
    const error = new HttpError('Fetching places failed, please try again later.', 500);
    return next(error);
  }

  //if (!userWithPlaces || userWithPlaces.places.length === 0) {
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError('Could not find places for the provided user id.', 404));
  }

  // Transform places to handle both old and new image path formats
  const transformedPlaces = userWithPlaces.places.map(place => {
    const placeObj = place.toObject({ getters: true });
    
    // If the image path contains the full system path, extract just the filename
    if (placeObj.image && (placeObj.image.includes('uploads\\images\\') || placeObj.image.includes('uploads/images/'))) {
      placeObj.image = placeObj.image.split(/[\\\/]/).pop(); // Get just the filename
    }
    
    // Construct full image URL
    if (placeObj.image) {
      placeObj.image = `${req.protocol}://${req.get('host')}/uploads/images/${placeObj.image}`;
    }
    
    return placeObj;
  });

  res.json({ places: transformedPlaces });
};


// ✅ POST /api/places/
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, address} = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.filename, // Store just the filename, not the full path
    creator: req.userData.userId // Assuming user ID is stored in req.userData
  });

  let user;
  try {
    user = await User.findById(req.userData.userId); // Fetch user by ID from request data
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404); 
    return next(error);
  }

  console.log(user);

  try {
    const sess = await Place.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess }); 
    user.places.push(createdPlace); // Assuming User model has a places field
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500);
    return next(error);
  }

  // Convert to object and add full image URL
  const placeObj = createdPlace.toObject({ getters: true });
  if (placeObj.image) {
    placeObj.image = `${req.protocol}://${req.get('host')}/uploads/images/${placeObj.image}`;
  }

  res.status(201).json({ place: placeObj });
};

// ✅ PATCH /api/places/:pid
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next( new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try{
    place =await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update place.', 500);
    return next(error); 
  }

  if(place.creator.toString() !== req.userData.userId){
    const error = new HttpError('You are not allowed to edit this place.', 401);
    return next(error); 
  }

  place.title = title;
  place.description = description;
 
  try{
    await place.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update place.', 500);
    return next(error);
  }

  // Convert to object and add full image URL
  const placeObj = place.toObject({ getters: true });
  if (placeObj.image) {
    placeObj.image = `${req.protocol}://${req.get('host')}/uploads/images/${placeObj.image}`;
  }

  res.status(200).json({ place: placeObj });
};

// ✅ DELETE /api/places/:pid
const deletePlace =async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place =await Place.findById(placeId).populate('creator'); // Populate creator to check if user exists
  } catch (err) {   
    const error = new HttpError('Something went wrong, could not delete place.', 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find place for this id.', 404);
    return next(error);
  }
  
  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError('You are not allowed to delete this place.', 401);
    return next(error); 
  }
  

const imagePath = path.join(__dirname, 'uploads', 'images', place.image);


  try {
    const sess = await Place.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place); // Assuming User model has a places field
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not delete place.', 500);
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err); 
  });

  res.status(200).json({ message: 'Deleted place.' });
};

exports.getAllPlaces = getAllPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
