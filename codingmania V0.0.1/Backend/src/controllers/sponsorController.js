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
const { notifyByRole } = require('../utils/notify');

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

// Add a single sponsor
const addSponsor = async (req, res) => {
  try {
    const { name, website } = req.body;

    if (!name || !website) {
      return res.status(400).json({ message: "Name and website are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Logo image is required" });
    }

    const uploadResult = await imagekit.upload({
      file: req.file.buffer,
      fileName: `sponsor_${Date.now()}`,
      folder: "/uploads/sponsors"
    });

    const sponsor = await prisma.sponsors.create({
      data: {
        name,
        website,
        logo: uploadResult.url,
        fileId: uploadResult.fileId
      }
    });

    await notifyByRole(req.app.get('io'), 'student', {
      type: 'sponsor',
      title: `New sponsor: ${sponsor.name}`,
      message: 'A new sponsor has joined CodingMania.',
      link: 'dashboard',
    });

    res.status(201).json(sponsor);
  } catch (error) {
    console.error("Add Sponsor Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a single sponsor (name/website always, logo only if a new file is sent)
const updateSponsor = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, website } = req.body;

    const existing = await prisma.sponsors.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (website !== undefined) data.website = website;

    // Replace the logo only when a new file is uploaded
    if (req.file) {
      if (existing.fileId) {
        try { await imagekit.deleteFile(existing.fileId); }
        catch (err) { console.error("Delete old logo failed:", err.message); }
      }

      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: `sponsor_${Date.now()}`,
        folder: "/uploads/sponsors"
      });

      data.logo = uploadResult.url;
      data.fileId = uploadResult.fileId;
    }

    const sponsor = await prisma.sponsors.update({ where: { id }, data });
    res.status(200).json(sponsor);
  } catch (error) {
    console.error("Update Sponsor Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a single sponsor (and its ImageKit logo)
const deleteSponsor = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await prisma.sponsors.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    if (existing.fileId) {
      try { await imagekit.deleteFile(existing.fileId); }
      catch (err) { console.error("Delete logo failed:", err.message); }
    }

    await prisma.sponsors.delete({ where: { id } });
    res.status(200).json({ message: "Sponsor deleted" });
  } catch (error) {
    console.error("Delete Sponsor Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addSponsors, getSponsors, addSponsor, updateSponsor, deleteSponsor };
