// local uploads folder multer config
// const multer = require('multer');
// const path = require('path');

// // Storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         if (file.fieldname === 'video') {
//             cb(null, 'uploads/videos/');
//         } else if (file.fieldname === 'thumbnail') {
//             cb(null, 'uploads/thumbnails/');
//         } else if (file.fieldname === 'proposal') {
//             cb(null, 'uploads/proposals/');
//         } else if (file.fieldname === 'image') {
//             cb(null, 'uploads/images/');
//         } else if (file.fieldname === 'logos') {
//             cb(null, 'uploads/logos/');
//         } else {
//             cb(null, 'uploads/');
//         }
//     },
//     filename: (req, file, cb) => {
//         // Generate unique filename using timestamp and original extension
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = {
//         proposal: ['.ppt', '.pptx', '.pdf'],
//         video: ['.mp4', '.avi', '.mov'],
//         thumbnail: ['.jpg', '.jpeg', '.png'],
//         image: ['.jpg', '.jpeg', '.png'],
//         logos: ['.jpg', '.jpeg', '.png']
//     };
    
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (file.fieldname in allowedTypes && allowedTypes[file.fieldname].includes(ext)) {
//         cb(null, true);
//     } else {
//         cb(new Error(`Invalid file type for ${file.fieldname}`));
//     }
// };

// // Create upload middleware
// const upload = multer({ 
//     storage: storage, 
//     fileFilter: fileFilter,
//     limits: { fileSize: 50 * 1024 * 1024 } 
// });

// module.exports = {
//     upload
// };











//imagkit version
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    proposal: ['.ppt', '.pptx', '.pdf'],
    video: ['.mp4', '.avi', '.mov'],
    thumbnail: ['.jpg', '.jpeg', '.png'],
    image: ['.jpg', '.jpeg', '.png'],
    logos: ['.jpg', '.jpeg', '.png']
  };

  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname in allowedTypes && allowedTypes[file.fieldname].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// 📂 Decide ImageKit Folder
const getFolderPath = (fieldname) => {
  switch (fieldname) {
    case 'video': return '/uploads/videos';
    case 'thumbnail': return '/uploads/thumbnails';
    case 'proposal': return '/uploads/proposals';
    case 'image': return '/uploads/images';
    case 'logos': return '/uploads/logos';
    default: return '/uploads/misc';
  }
};

module.exports = {
  upload,
  getFolderPath
};
