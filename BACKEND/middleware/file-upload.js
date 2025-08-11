const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const fs = require('fs');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

// Ensure directory exists
const imageDir = path.join(__dirname, '..', 'uploads', 'images');
try {
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
    console.log('✅ Created uploads directory:', imageDir);
  }
} catch (error) {
  console.error('❌ Failed to create uploads directory:', error);
  console.log('⚠️  File uploads may fail on this deployment platform');
}

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mern-app-images', // Change folder name as needed
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const fileUpload = multer({
  limits: { fileSize: 500000 },
  storage: storage
});

module.exports = fileUpload;
