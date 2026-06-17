// const path = require('path');
// const fs = require('fs');
// const prisma = require('../../prisma/client');

// // Upload slides controller
// const uploadSlide = async (req, res) => {
//     try {
//         const slides = JSON.parse(req.body.slides);
//         const files = req.files;

//         if (!slides || !files || slides.length !== 3 || files.length !== 3) {
//             return res.status(400).json({ message: "Please provide exactly 3 slides with images" });
//         }

//         // Retrieve existing images
//         const existingSlides = await prisma.carouseltable.findMany();
        
//         // Store old image paths
//         const oldImagePaths = existingSlides.map(slide => path.join(__dirname, '../../', slide.image));

//         // Delete all records first
//         await prisma.carouseltable.deleteMany();

//         // Insert new slides
//         const newSlides = await prisma.$transaction(
//             slides.map((slide, index) =>
//                 prisma.carouseltable.create({
//                     data: {
//                         title: slide.title,
//                         description: slide.description,
//                         image: `/uploads/images/${files[index].filename}`
//                     }
//                 })
//             )
//         );

//         // Delete old images from server
//         oldImagePaths.forEach(imagePath => {
//             if (fs.existsSync(imagePath)) {
//                 fs.unlinkSync(imagePath);
//             }
//         });

//         res.status(201).json({ message: "Slides uploaded successfully" });
//     } catch (error) {
//         console.error("Upload Server Error: ", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// // Get slides controller
// const getSlides = async (req, res) => {
//     try {
//         const slides = await prisma.carouseltable.findMany({
//             orderBy: { id: 'desc' },
//             take: 3
//         });
//         res.status(200).json(slides);
//     } catch (error) {
//         console.error("Fetch Error: ", error);
//         res.status(500).json({ message: "Error fetching slides" });
//     }
// };

// module.exports = {
//     uploadSlide,
//     getSlides
// };






















// //imgkit version
// const prisma = require('../../prisma/client');
// const imagekit = require('../config/imagekit'); // adjust path if needed

// // Upload slides
// const uploadSlide = async (req, res) => {
//   try {
//     const slides = JSON.parse(req.body.slides);
//     const files = req.files;

//     if (!slides || !files || slides.length !== 3 || files.length !== 3) {
//       return res.status(400).json({ message: "Please provide exactly 3 slides with images" });
//     }

//     // Fetch old slides to delete old images from ImageKit
//     const existingSlides = await prisma.carouseltable.findMany();

//     // Delete DB records first
//     await prisma.carouseltable.deleteMany();

//     // Delete old images from ImageKit
//     for (const slide of existingSlides) {
//       if (slide.fileId) {
//         try {
//           await imagekit.deleteFile(slide.fileId);
//         } catch (err) {
//           console.error("ImageKit delete failed:", err.message);
//         }
//       }
//     }

//     // Upload new images to ImageKit + save DB
//     const newSlides = [];

//     for (let i = 0; i < slides.length; i++) {
//       const file = files[i];

//       const uploadResult = await imagekit.upload({
//         file: file.buffer,
//         fileName: `carousel_${Date.now()}_${i}`,
//         folder: "/uploads/carousel"
//       });

//       const createdSlide = await prisma.carouseltable.create({
//         data: {
//           title: slides[i].title,
//           description: slides[i].description,
//           image: uploadResult.url,     // 🔥 FULL ImageKit URL
//           fileId: uploadResult.fileId  // 🔥 Needed for delete later
//         }
//       });

//       newSlides.push(createdSlide);
//     }

//     res.status(201).json({ message: "Slides uploaded successfully", slides: newSlides });

//   } catch (error) {
//     console.error("Upload Server Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };


// // Get slides
// const getSlides = async (req, res) => {
//   try {
//     const slides = await prisma.carouseltable.findMany({
//       orderBy: { id: 'desc' },
//       take: 3
//     });

//     res.status(200).json(slides);
//   } catch (error) {
//     console.error("Fetch Error:", error);
//     res.status(500).json({ message: "Error fetching slides" });
//   }
// };

// module.exports = {
//    uploadSlide,
//     getSlides 
//   };



















//6 slids code 
// Updated carouselController.js
const prisma = require('../../prisma/client');
const imagekit = require('../config/imagekit'); // adjust path if needed

// Get all slides
const getSlides = async (req, res) => {
  try {
    const slides = await prisma.carouseltable.findMany({
      orderBy: { id: 'asc' },
    });
    res.status(200).json(slides);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Error fetching slides" });
  }
};

// Create a new slide
const createSlide = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!title || !description || !file) {
      return res.status(400).json({ message: "Title, description, and image are required" });
    }

    // Check max 6 slides
    const count = await prisma.carouseltable.count();
    if (count >= 6) {
      return res.status(400).json({ message: "Maximum 6 slides allowed" });
    }

    const uploadResult = await imagekit.upload({
      file: file.buffer,
      fileName: `carousel_${Date.now()}`,
      folder: "/uploads/carousel"
    });

    const newSlide = await prisma.carouseltable.create({
      data: {
        title,
        description,
        image: uploadResult.url,
        fileId: uploadResult.fileId
      }
    });

    res.status(201).json(newSlide);
  } catch (error) {
    console.error("Create Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a slide
const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const file = req.file;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const existingSlide = await prisma.carouseltable.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingSlide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    let image = existingSlide.image;
    let fileId = existingSlide.fileId;

    if (file) {
      // Delete old image if exists
      if (fileId) {
        try {
          await imagekit.deleteFile(fileId);
        } catch (err) {
          console.error("ImageKit delete failed:", err.message);
        }
      }

      const uploadResult = await imagekit.upload({
        file: file.buffer,
        fileName: `carousel_${Date.now()}`,
        folder: "/uploads/carousel"
      });

      image = uploadResult.url;
      fileId = uploadResult.fileId;
    }

    const updatedSlide = await prisma.carouseltable.update({
      where: { id: parseInt(id) },
      data: { title, description, image, fileId }
    });

    res.status(200).json(updatedSlide);
  } catch (error) {
    console.error("Update Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a slide
const deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const existingSlide = await prisma.carouseltable.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingSlide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    // Delete image from ImageKit if exists
    if (existingSlide.fileId) {
      try {
        await imagekit.deleteFile(existingSlide.fileId);
      } catch (err) {
        console.error("ImageKit delete failed:", err.message);
      }
    }

    await prisma.carouseltable.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error("Delete Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getSlides,
  createSlide,
  updateSlide,
  deleteSlide
};