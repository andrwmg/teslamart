const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_KEY,
    // api_secret: process.env.CLOUDINARY_SECRET
    cloud_name: 'deuft4auk',
api_key: 487177743372152,
api_secret: 'MFTuBFYrjaj-wDWjpOam7kL6SBI'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'teslamart',
      allowedFormats: ['jpeg','png','jpg']
    }
    });

module.exports = {
    cloudinary,
    storage
}

