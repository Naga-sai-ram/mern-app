const mongoose = require('mongoose');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://naga:xpUNCpwVR8xNtmhU@cluster0.jvdrm4l.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0';

async function checkUserImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users to check`);

    for (const user of users) {
      console.log(`\nUser: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Image path: ${user.image}`);
      
      // Check if the image path contains the full system path
      if (user.image && (user.image.includes('uploads\\images\\') || user.image.includes('uploads/images/'))) {
        const filename = user.image.split(/[\\\/]/).pop();
        console.log(`⚠️  Full path detected, should be just: ${filename}`);
        
        // Update to just filename
        user.image = filename;
        await user.save();
        console.log(`✅ Updated user ${user.name}: ${user.image} -> ${filename}`);
      } else {
        console.log(`✅ Image path looks correct: ${user.image}`);
      }
    }

    console.log('\n✅ User image check completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking user images:', error);
    process.exit(1);
  }
}

checkUserImages(); 