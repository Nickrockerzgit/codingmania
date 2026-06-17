// const express = require('express');
// const router = express.Router();
// const carouselController = require('../controllers/carouselController');
// const { upload } = require('../config/multer');

// // Carousel routes
// router.post('/upload-slide', upload.array('image', 3), carouselController.uploadSlide);
// router.get('/get-slides', carouselController.getSlides);

// module.exports = router;





// 6 slids code
// Updated carouselRoutes.js
const express = require('express');
const router = express.Router();
const carouselController = require('../controllers/carouselController');
const { upload } = require('../config/multer');

// Carousel routes
router.get('/get-slides', carouselController.getSlides);
router.post('/create-slide', upload.single('image'), carouselController.createSlide);
router.put('/update-slide/:id', upload.single('image'), carouselController.updateSlide);
router.delete('/delete-slide/:id', carouselController.deleteSlide);

module.exports = router;