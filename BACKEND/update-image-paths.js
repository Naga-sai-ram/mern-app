const mongoose = require('mongoose');
const path = require('path');
const Place = require('./models/place');

const MONGODB_URI = 'mongodb+srv://naga:xpUNCpwVR8xNtmhU@cluster0.jvdrm4l.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0';

async function updateImagePaths() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const places = await Place.find({});
    console.log(`Found ${places.length} places to update`);

    for (const place of places) {
      if (place.image && (place.image.includes('uploads\\images\\') || place.image.includes('uploads/images/'))) {
        const filename = place.image.split(/[\\\/]/).pop();
        place.image = filename;
        await place.save();
        console.log(`Updated place ${place._id}: ${place.image} -> ${filename}`);
      }
    }

    console.log('✅ Image paths updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating image paths:', error);
    process.exit(1);
  }
}

updateImagePaths(); 