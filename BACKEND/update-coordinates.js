const mongoose = require('mongoose');
const getCoordsForAddress = require('./util/location');
const Place = require('./models/place');

const MONGODB_URI = 'mongodb+srv://naga:xpUNCpwVR8xNtmhU@cluster0.jvdrm4l.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0';

async function updateCoordinates() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const places = await Place.find({});
    console.log(`Found ${places.length} places to update`);

    for (const place of places) {
      try {
        console.log(`Updating coordinates for: ${place.title} (${place.address})`);
        const coordinates = await getCoordsForAddress(place.address);
        
        place.location = coordinates;
        await place.save();
        
        console.log(`✅ Updated ${place.title}: ${coordinates.lat}, ${coordinates.lng}`);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to update ${place.title}:`, error.message);
      }
    }

    console.log('✅ Coordinates update completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating coordinates:', error);
    process.exit(1);
  }
}

updateCoordinates(); 