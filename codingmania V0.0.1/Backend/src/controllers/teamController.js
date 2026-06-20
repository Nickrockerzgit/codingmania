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
        // Member metadata sent as a JSON string from the frontend
        const members = req.body.members ? JSON.parse(req.body.members) : [];
        // Maps each uploaded file (in order) to the member index it belongs to
        const imageIndexes = req.body.imageIndexes ? JSON.parse(req.body.imageIndexes) : [];
        const files = req.files || [];

        // Build a lookup: member index -> uploaded file
        const fileForMember = {};
        imageIndexes.forEach((memberIdx, i) => {
            if (files[i]) fileForMember[memberIdx] = files[i];
        });

        // Existing members (needed to clean up images that are no longer used)
        const existingMembers = await prisma.team.findMany();

        // fileIds that are being reused (existing image kept by an edited member)
        const keepFileIds = new Set(
            members.map(m => m.existingFileId).filter(Boolean)
        );

        await prisma.team.deleteMany();

        // Delete only the ImageKit images that are NOT being reused
        for (const member of existingMembers) {
            if (member.fileId && !keepFileIds.has(member.fileId)) {
                try { await imagekit.deleteFile(member.fileId); }
                catch (err) { console.error("Image delete failed:", err.message); }
            }
        }

        const newMembers = [];

        for (let i = 0; i < members.length; i++) {
            const m = members[i];

            // Default: keep the member's existing image (if any)
            let imageUrl = m.existingImage || null;
            let fileId = m.existingFileId || null;

            // If a new file was uploaded for this member, upload it and replace
            const file = fileForMember[i];
            if (file) {
                const uploadResult = await imagekit.upload({
                    file: file.buffer,
                    fileName: `team_${Date.now()}_${i}`,
                    folder: "/uploads/team"
                });

                imageUrl = uploadResult.url;
                fileId = uploadResult.fileId;
            }

            const member = await prisma.team.create({
                data: {
                    name: m.name || '',
                    role: m.role || '',
                    image: imageUrl,
                    fileId,
                    github: m.github || '',
                    linkedin: m.linkedin || ''
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

// Create OR update a SINGLE team member (used by the per-member Update button)
const saveTeamMember = async (req, res) => {
    try {
        const { id, name, role, github, linkedin } = req.body;

        let imageUrl = null;
        let fileId = null;

        if (id) {
            // ----- Update existing member -----
            const existing = await prisma.team.findUnique({ where: { id: Number(id) } });
            if (!existing) {
                return res.status(404).json({ message: "Member not found" });
            }

            // Keep the current image unless a new one is uploaded
            imageUrl = existing.image;
            fileId = existing.fileId;

            if (req.file) {
                // Remove the old image from ImageKit first
                if (existing.fileId) {
                    try { await imagekit.deleteFile(existing.fileId); }
                    catch (err) { console.error("Image delete failed:", err.message); }
                }

                const uploadResult = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: `team_${Date.now()}`,
                    folder: "/uploads/team"
                });
                imageUrl = uploadResult.url;
                fileId = uploadResult.fileId;
            }

            const updated = await prisma.team.update({
                where: { id: Number(id) },
                data: {
                    name: name || '',
                    role: role || '',
                    image: imageUrl,
                    fileId,
                    github: github || '',
                    linkedin: linkedin || ''
                }
            });

            return res.status(200).json({ message: "Member updated", member: updated });
        }

        // ----- Create new member -----
        if (req.file) {
            const uploadResult = await imagekit.upload({
                file: req.file.buffer,
                fileName: `team_${Date.now()}`,
                folder: "/uploads/team"
            });
            imageUrl = uploadResult.url;
            fileId = uploadResult.fileId;
        }

        const created = await prisma.team.create({
            data: {
                name: name || '',
                role: role || '',
                image: imageUrl,
                fileId,
                github: github || '',
                linkedin: linkedin || ''
            }
        });

        return res.status(201).json({ message: "Member created", member: created });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a SINGLE team member (also removes its ImageKit image)
const deleteTeamMember = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const existing = await prisma.team.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "Member not found" });
        }

        if (existing.fileId) {
            try { await imagekit.deleteFile(existing.fileId); }
            catch (err) { console.error("Image delete failed:", err.message); }
        }

        await prisma.team.delete({ where: { id } });

        res.status(200).json({ message: "Member deleted" });
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

module.exports = { addTeamMember, saveTeamMember, deleteTeamMember, getTeamMembers };
