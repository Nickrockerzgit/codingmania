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
const razorpay = require('../config/razorpay');
const crypto = require('crypto');



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


/* =========================================================
   CREATE RAZORPAY ORDER (amount = event entry fee)
========================================================= */
const createPaymentOrder = async (req, res) => {
    try {
        const { eventId } = req.body;
        if (!eventId) return res.status(400).json({ error: 'eventId is required' });

        const event = await prisma.events.findUnique({ where: { id: Number(eventId) } });
        if (!event) return res.status(404).json({ error: 'Event not found' });

        // Parse entry fee → integer rupees (handles "₹100", "100", "Free", etc.)
        const amountRupees = parseInt(String(event.entry_fee || '0').replace(/[^0-9]/g, ''), 10) || 0;

        // Free event → skip payment
        if (amountRupees <= 0) {
            return res.status(200).json({ free: true, amount: 0, eventTitle: event.title });
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ error: 'Payment is not configured. Please add Razorpay keys in .env.' });
        }

        const order = await razorpay.orders.create({
            amount: amountRupees * 100, // amount in paise
            currency: 'INR',
            receipt: `evt_${eventId}_${Date.now()}`,
        });

        res.status(200).json({
            free: false,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            eventTitle: event.title,
            displayFee: event.entry_fee,
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create payment order' });
    }
};

/* =========================================================
   VERIFY PAYMENT + SAVE REGISTRATION + EMAIL LEADER
========================================================= */
const verifyAndRegister = async (req, res) => {
    try {
        const {
            eventId, free,
            razorpay_order_id, razorpay_payment_id, razorpay_signature,
            teamName, leaderName, leaderEmail, leaderPhone, collegeName,
            members, category,
        } = req.body;

        // Verify Razorpay signature for paid registrations
        if (!free) {
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                return res.status(400).json({ error: 'Missing payment details' });
            }
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest('hex');
            if (expectedSignature !== razorpay_signature) {
                return res.status(400).json({ error: 'Payment verification failed' });
            }
        }

        // Fetch event for DB + email details
        let event = null;
        if (eventId) {
            event = await prisma.events.findUnique({ where: { id: Number(eventId) } });
        }
        const eventName = event ? event.title : (category || 'Event');

        // members may arrive as a JSON string
        let parsedMembers = members;
        try { if (typeof members === 'string') parsedMembers = JSON.parse(members); } catch { parsedMembers = []; }

        const newRegistration = await prisma.eventdata.create({
            data: {
                team_name: teamName,
                team_leader_name: leaderName,
                team_leader_email: leaderEmail,
                team_leader_phone: leaderPhone || null,
                college_name: collegeName || null,
                members: parsedMembers || [],
                category: category || eventName,
                payment_id: razorpay_payment_id || null,
                payment_order_id: razorpay_order_id || null,
                status: free ? 'pending' : 'paid',
            },
        });

        // Send confirmation email to team leader with event details
        const formatDate = (d) => {
            try {
                return new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
            } catch { return d; }
        };

        await sendEmail(
            leaderEmail,
            `Registration Confirmed: ${eventName}`,
            emailTemplates.eventRegistrationDetails(leaderName, {
                eventName,
                teamName,
                college: collegeName,
                category,
                date: event ? formatDate(event.date) : '',
                location: event ? event.location : '',
                fee: event ? event.entry_fee : '',
                paymentId: razorpay_payment_id || '',
            })
        );

        res.status(201).json({ message: 'Registration successful', id: newRegistration.id });
    } catch (error) {
        console.error('Verify & register error:', error);
        res.status(500).json({ error: 'Failed to complete registration' });
    }
};

module.exports = {
    registerEvent,
    getRegistrations,
    deleteRegistration,
    updateRegistrationStatus,
    createPaymentOrder,
    verifyAndRegister,
};
