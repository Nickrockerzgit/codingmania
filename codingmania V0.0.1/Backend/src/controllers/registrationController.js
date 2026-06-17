// const prisma = require('../../prisma/client');
// const { sendEmail } = require('../config/email');
// const emailTemplates = require('../utils/emailTemplates');

// // Register for event controller
// const registerEvent = async (req, res) => {
//     try {
//         const {
//             teamName,
//             leaderName,
//             leaderEmail,
//             leaderPhone,
//             members,
//             category,
//             projectName,
//             projectDescription,
//             githubRepo,
//             linkedinProfile
//         } = req.body;

//         // Get the file path if a file was uploaded
//         const projectProposalPath = req.file ? `/uploads/proposals/${req.file.filename}` : null;

//         // Get event name from category if possible
//         let eventName = category;
//         try {
//             const event = await prisma.event.findFirst({
//                 where: { categories: { contains: category } },
//                 select: { title: true }
//             });
//             if (event) eventName = event.title;
//         } catch (error) {
//             console.error("Error fetching event name:", error);
//         }

//         // Insert into database
//         const newRegistration = await prisma.eventdata.create({
//             data: {
//                 team_name: teamName,
//                 team_leader_name: leaderName,
//                 team_leader_email: leaderEmail,
//                 team_leader_phone: leaderPhone,
//                 members,
//                 category,
//                 project_name: projectName,
//                 project_description: projectDescription,
//                 github: githubRepo,
//                 linkedin: linkedinProfile,
//                 project_proposal: projectProposalPath
//             }
//         });
        
//         // Send event registration confirmation email
//         await sendEmail(
//             leaderEmail,
//             `Event Registration Confirmation: ${eventName}`,
//             emailTemplates.eventRegistration(leaderName, eventName)
//         );
        
//         res.status(201).json({ 
//             message: 'Registration successful',
//             id: newRegistration.id
//         });
//     } catch (error) {
//         console.error('Server error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// // Get all event registrations controller
// const getRegistrations = async (req, res) => {
//     try {
//         const registrations = await prisma.eventdata.findMany();
//         res.status(200).json(registrations);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ error: 'Failed to fetch registrations' });
//     }
// };

// module.exports = {
//     registerEvent,
//     getRegistrations
// };









//imagkit version 
const prisma = require('../../prisma/client');
const imagekit = require('../config/imagekit');
const { sendEmail } = require('../config/email');
const emailTemplates = require('../utils/emailTemplates');



/* =========================================================
   REGISTER EVENT (UPLOAD PROPOSAL TO IMAGEKIT)
========================================================= */
const registerEvent = async (req, res) => {
    try {
        const {
            teamName,
            leaderName,
            leaderEmail,
            leaderPhone,
            members,
            category,
            projectName,
            projectDescription,
            githubRepo,
            linkedinProfile
        } = req.body;

        let proposalUrl = null;
        let proposalFileId = null;

        // 📂 Upload proposal file to ImageKit
        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `proposal_${Date.now()}_${req.file.originalname}`,
                folder: "/uploads/proposals"
            });

            proposalUrl = uploadResponse.url;
            proposalFileId = uploadResponse.fileId;
        }

        // 🔎 Find event name for email
        let eventName = category;
        try {
            const event = await prisma.events.findFirst({
                where: { categories: { contains: category } },
                select: { title: true }
            });
            if (event) eventName = event.title;
        } catch (error) {
            console.error("Error fetching event name:", error);
        }

        // 💾 Save registration
        const newRegistration = await prisma.eventdata.create({
            data: {
                team_name: teamName,
                team_leader_name: leaderName,
                team_leader_email: leaderEmail,
                team_leader_phone: leaderPhone,
                members,
                category,
                project_name: projectName,
                project_description: projectDescription,
                github: githubRepo,
                linkedin: linkedinProfile,
                project_proposal: proposalUrl,
                proposalFileId: proposalFileId
            }
        });

        // 📧 Send confirmation mail
        await sendEmail(
            leaderEmail,
            `Event Registration Confirmation: ${eventName}`,
            emailTemplates.eventRegistration(leaderName, eventName)
        );

        res.status(201).json({
            message: 'Registration successful',
            id: newRegistration.id
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



/* =========================================================
   GET ALL REGISTRATIONS (ADMIN DASHBOARD)
========================================================= */
const getRegistrations = async (req, res) => {
    try {
        const registrations = await prisma.eventdata.findMany({
            orderBy: { created_at: 'desc' }
        });

        // Parse members JSON safely
        const formatted = registrations.map(reg => ({
            ...reg,
            members: (() => {
                try {
                    return typeof reg.members === 'string'
                        ? JSON.parse(reg.members)
                        : reg.members;
                } catch {
                    return [];
                }
            })()
        }));

        res.status(200).json(formatted);

    } catch (error) {
        console.error('Fetch registrations error:', error);
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
};



/* =========================================================
   DELETE REGISTRATION (OPTIONAL ADMIN FEATURE)
========================================================= */
const deleteRegistration = async (req, res) => {
    try {
        const { id } = req.params;

        const registration = await prisma.eventdata.findUnique({
            where: { id: Number(id) }
        });

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // Delete proposal from ImageKit if exists
        if (registration.proposalFileId) {
            await imagekit.deleteFile(registration.proposalFileId);
        }

        await prisma.eventdata.delete({
            where: { id: Number(id) }
        });

        res.status(200).json({ message: 'Registration deleted successfully' });

    } catch (error) {
        console.error('Delete registration error:', error);
        res.status(500).json({ error: 'Failed to delete registration' });
    }
};
   

/* =========================================================
  // NEW: Accept / Reject Registration + Send Email
========================================================= */

const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const registration = await prisma.eventdata.findUnique({
      where: { id: Number(id) },
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const newStatus = action === 'accept' ? 'accepted' : 'rejected';

    // Update status in DB
    await prisma.eventdata.update({
      where: { id: Number(id) },
      data: { status: newStatus },
    });

    // Get event name (same as registration time)
    let eventName = registration.category;
    try {
      const event = await prisma.events.findFirst({
        where: { categories: { contains: registration.category } },
        select: { title: true }
      });
      if (event) eventName = event.title;
    } catch (err) {
      console.error("Event name fetch failed:", err);
    }

    // Send email to team leader
    const subject = action === 'accept'
      ? `Congratulations! Your Registration for ${eventName} has been Accepted`
      : `Update on Your Registration for ${eventName}`;

    const htmlTemplate = action === 'accept'
      ? emailTemplates.eventAccepted(registration.team_leader_name, eventName)
      : emailTemplates.eventRejected(registration.team_leader_name, eventName);

    const emailSent = await sendEmail(
      registration.team_leader_email,
      subject,
      htmlTemplate
    );

    if (!emailSent) {
      console.warn(`Email failed for registration ${id}`);
    }

    res.status(200).json({
      message: `Registration ${action}ed successfully`,
      status: newStatus,
      emailSent: emailSent
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};


module.exports = {
    registerEvent,
    getRegistrations,
    deleteRegistration,
    updateRegistrationStatus,
};
