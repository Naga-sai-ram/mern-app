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
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

const fileUpload = multer({
  limits: { fileSize: 500000 },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, imageDir);
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid() + '.' + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    cb(isValid ? null : new Error('Invalid mime type!'), isValid);
  }
});

module.exports = fileUpload;
