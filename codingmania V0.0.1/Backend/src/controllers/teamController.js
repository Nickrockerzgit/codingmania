// const prisma = require('../../prisma/client');

// // Add team member controller
// const addTeamMember = async (req, res) => {
//     try {
//         console.log("Received Files:", req.files);
//         console.log("Received Body:", req.body);

//         // Delete existing team members
//         await prisma.team.deleteMany();

//         const names = Array.isArray(req.body.name) ? req.body.name : [req.body.name];
//         const roles = Array.isArray(req.body.role) ? req.body.role : [req.body.role];
//         const githubs = Array.isArray(req.body.github) ? req.body.github : [req.body.github];
//         const linkedins = Array.isArray(req.body.linkedin) ? req.body.linkedin : [req.body.linkedin];
//         const files = req.files || [];

//         console.log("Uploaded Files:", files);

//         const newMembers = await prisma.$transaction(
//             names.map((name, index) =>
//                 prisma.team.create({
//                     data: {
//                         name,
//                         role: roles[index],
//                         image: files[index] ? `/uploads/images/${files[index].filename}` : null,
//                         github: githubs[index],
//                         linkedin: linkedins[index]
//                     }
//                 })
//             )
//         );

//         res.status(201).json({ 
//             message: "Team members added successfully",
//             count: newMembers.length 
//         });
//     } catch (error) {
//         console.error("Server Error:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// // Get team members controller
// const getTeamMembers = async (req, res) => {
//     try {
//         const members = await prisma.team.findMany({
//             orderBy: { id: 'asc' }
//         });
//         res.status(200).json(members);
//     } catch (error) {
//         console.error("Fetch Error:", error);
//         res.status(500).json({ message: "Error fetching team members" });
//     }
// };

// module.exports = {
//     addTeamMember,
//     getTeamMembers
// };









//imagkit version
const prisma = require('../../prisma/client');
const imagekit = require('../config/imagekit');

const addTeamMember = async (req, res) => {
    try {
        const names = Array.isArray(req.body.name) ? req.body.name : [req.body.name];
        const roles = Array.isArray(req.body.role) ? req.body.role : [req.body.role];
        const githubs = Array.isArray(req.body.github) ? req.body.github : [req.body.github];
        const linkedins = Array.isArray(req.body.linkedin) ? req.body.linkedin : [req.body.linkedin];
        const files = req.files || [];

        // Get old members to delete old images
        const existingMembers = await prisma.team.findMany();

        await prisma.team.deleteMany();

        // Delete old images from ImageKit
        for (const member of existingMembers) {
            if (member.fileId) {
                try { await imagekit.deleteFile(member.fileId); }
                catch (err) { console.error("Image delete failed:", err.message); }
            }
        }

        const newMembers = [];

        for (let i = 0; i < names.length; i++) {
            let imageUrl = null;
            let fileId = null;

            if (files[i]) {
                const uploadResult = await imagekit.upload({
                    file: files[i].buffer,
                    fileName: `team_${Date.now()}_${i}`,
                    folder: "/uploads/team"
                });

                imageUrl = uploadResult.url;
                fileId = uploadResult.fileId;
            }

            const member = await prisma.team.create({
                data: {
                    name: names[i],
                    role: roles[i],
                    image: imageUrl,
                    fileId,
                    github: githubs[i],
                    linkedin: linkedins[i]
                }
            });

            newMembers.push(member);
        }

        res.status(201).json({ message: "Team updated", members: newMembers });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getTeamMembers = async (req, res) => {
    try {
        const members = await prisma.team.findMany({ orderBy: { id: 'asc' } });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Error fetching team members" });
    }
};

module.exports = { addTeamMember, getTeamMembers };
