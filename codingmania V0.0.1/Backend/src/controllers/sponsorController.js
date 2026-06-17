// const prisma = require('../../prisma/client');

// // Add sponsors controller
// const addSponsors = async (req, res) => {
//     try {
//         // First, clear existing sponsors
//         await prisma.sponsors.deleteMany();
    
//         const names = Array.isArray(req.body.name) ? req.body.name : [req.body.name];
//         const websites = Array.isArray(req.body.website) ? req.body.website : [req.body.website];
//         const files = req.files || [];
    
//         // Ensure each sponsor gets the correct logo
//         const newSponsors = await prisma.$transaction(
//             names.map((name, index) =>
//                 prisma.sponsors.create({
//                     data: {
//                         name,
//                         logo: files[index] ? `/uploads/logos/${files[index].filename}` : null,
//                         website: websites[index]
//                     }
//                 })
//             )
//         );
    
//         res.status(201).json({ 
//             message: "Sponsors added successfully",
//             count: newSponsors.length 
//         });
//     } catch (error) {
//         console.error("Server Error:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// // Get sponsors controller
// const getSponsors = async (req, res) => {
//     try {
//         const sponsors = await prisma.sponsors.findMany({
//             orderBy: { id: 'asc' }
//         });
//         res.status(200).json(sponsors);
//     } catch (error) {
//         console.error("Fetch Error:", error);
//         res.status(500).json({ message: "Error fetching sponsors" });
//     }
// };

// module.exports = {
//     addSponsors,
//     getSponsors
// };








//imagekit version
const prisma = require('../../prisma/client');
const imagekit = require('../config/imagekit');

// Add sponsors
const addSponsors = async (req, res) => {
  try {
    const names = Array.isArray(req.body.name) ? req.body.name : [req.body.name];
    const websites = Array.isArray(req.body.website) ? req.body.website : [req.body.website];
    const files = req.files || [];

    // Fetch old sponsors to delete old logos
    const existingSponsors = await prisma.sponsors.findMany();

    await prisma.sponsors.deleteMany();

    // Delete old images from ImageKit
    for (const sponsor of existingSponsors) {
      if (sponsor.fileId) {
        try { await imagekit.deleteFile(sponsor.fileId); }
        catch (err) { console.error("Delete failed:", err.message); }
      }
    }

    const newSponsors = [];

    for (let i = 0; i < names.length; i++) {
      let logoUrl = null;
      let fileId = null;

      if (files[i]) {
        const uploadResult = await imagekit.upload({
          file: files[i].buffer,
          fileName: `sponsor_${Date.now()}_${i}`,
          folder: "/uploads/sponsors"
        });
        logoUrl = uploadResult.url;
        fileId = uploadResult.fileId;
      }

      const sponsor = await prisma.sponsors.create({
        data: {
          name: names[i],
          website: websites[i],
          logo: logoUrl,
          fileId
        }
      });

      newSponsors.push(sponsor);
    }

    res.status(201).json({ message: "Sponsors updated", sponsors: newSponsors });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get sponsors
const getSponsors = async (req, res) => {
  try {
    const sponsors = await prisma.sponsors.findMany({ orderBy: { id: 'asc' } });
    res.status(200).json(sponsors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sponsors" });
  }
};

module.exports = { addSponsors, getSponsors };
