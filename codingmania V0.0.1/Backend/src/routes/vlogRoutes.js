// const express = require('express');
// const router = express.Router();
// const vlogController = require('../controllers/vlogController');
// const { upload } = require('../config/multer');

// // Vlog routes
// router.post('/upload-vlog', upload.fields([
//     { name: 'video', maxCount: 1 },
//     { name: 'thumbnail', maxCount: 1 }
// ]), vlogController.uploadVlog);
// router.get('/get-vlogs', vlogController.getVlogs);
// router.post('/increment-views/:id', vlogController.incrementViews);
// router.post('/like-vlog/:id', vlogController.likeVlog);

// module.exports = router;








//imgkit version
const express = require('express');
const router = express.Router();
const vlogController = require('../controllers/vlogController');
const { upload } = require('../config/multer');

// Update multer limit to 500MB (frontend ke hisaab se)
const upload50MB = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

router.post('/upload-vlog', upload50MB, vlogController.uploadVlog);
router.put('/update-vlog/:id', upload50MB, vlogController.updateVlog);
router.delete('/delete-vlog/:id', vlogController.deleteVlog);

router.get('/get-vlogs', vlogController.getVlogs);
router.post('/increment-views/:id', vlogController.incrementViews);
router.post('/like-vlog/:id', vlogController.likeVlog);

module.exports = router;