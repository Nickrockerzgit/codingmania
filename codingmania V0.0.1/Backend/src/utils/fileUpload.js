//local file handling multer config
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Enhanced storage configuration for profile images
// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = 'uploads/images/';
    
//     // Create directory if it doesn't exist
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
    
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     // Generate unique filename with user ID and timestamp
//     const userId = req.user ? req.user.id : 'anonymous';
//     const timestamp = Date.now();
//     const ext = path.extname(file.originalname);
//     const filename = `profile_${userId}_${timestamp}${ext}`;
//     cb(null, filename);
//   }
// });

// // File filter for profile images
// const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// const profileFileFilter = (req, file, cb) => {
//   console.log("Mimetype received:", file.mimetype); // Debug line
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files (JPG, PNG, GIF, WEBP) are allowed'));
//   }
// };


// // Profile upload middleware
// const profileUpload = multer({
//   storage: profileStorage,
//   fileFilter: profileFileFilter,
//   limits: {
//     fileSize: 2 * 1024 * 1024, // 2MB limit
//     files: 1
//   }
// });

// // Delete file utility
// const deleteFile = (filePath) => {
//   try {
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//       return true;
//     }
//   } catch (error) {
//     console.error('Error deleting file:', error);
//   }
//   return false;
// };

// module.exports = {
//   profileUpload,
//   deleteFile
// };





//imagekit upload multer config
const multer = require('multer');
const path = require('path');
const imagekit = require('../config/imagekit');

// Use memory storage instead of disk
const storage = multer.memoryStorage();

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

const profileFileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, GIF, WEBP) are allowed'));
  }
};

const profileUpload = multer({
  storage,
  fileFilter: profileFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1
  }
});

// 🔥 Upload profile image to ImageKit
const uploadProfileToImageKit = async (file, userId) => {
  const ext = path.extname(file.originalname);
  const fileName = `profile_${userId}_${Date.now()}${ext}`;

  const result = await imagekit.upload({
    file: file.buffer,
    fileName,
    folder: "/uploads/profile-images"
  });

  return result; // contains url + fileId
};

// 🔥 Delete from ImageKit using fileId
const deleteFile = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    console.error("ImageKit delete error:", error.message);
    return false;
  }
};

module.exports = {
  profileUpload,
  uploadProfileToImageKit,
  deleteFile
};
