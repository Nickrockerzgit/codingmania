const prisma = require('../../prisma/client');
const { sendEmail } = require('../config/email');
const emailTemplates = require('../utils/emailTemplates');

const SUPER_ADMIN_EMAIL = 'lancer969976@gmail.com';

const parseJsonArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const attachMatchedUsers = async (requests) => {
  const emails = requests.map((req) => req.email);
  const users = await prisma.users.findMany({
    where: {
      email: {
        in: emails,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      appliedRole: true,
      applicationStatus: true,
      adminAccess: true,
      superAdminAccess: true,
    },
  });

  const userByEmail = new Map(users.map((user) => [user.email, user]));

  return requests.map((req) => ({
    ...req,
    skills: parseJsonArray(req.skills),
    interests: parseJsonArray(req.interests),
    team_preferences: parseJsonArray(req.team_preferences),
    matchedUser: userByEmail.get(req.email) || null,
  }));
};

const joinUs = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      collegeName,
      courseStream,
      yearOfStudy,
      skills,
      interests,
      motivation,
      githubUrl,
      linkedinUrl,
      websiteUrl,
      teamPreferences,
    } = req.body;

    const currentUser = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        adminAccess: true,
        superAdminAccess: true,
      },
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'Logged-in user not found.' });
    }

    if (currentUser.adminAccess || currentUser.superAdminAccess) {
      return res.status(400).json({ error: 'You already have admin access.' });
    }

    const existing = await prisma.join_us.findFirst({
      where: {
        email: currentUser.email,
        role_applied: 'admin',
      },
      orderBy: { created_at: 'desc' },
    });

    if (existing && existing.status !== 'rejected') {
      return res.status(400).json({ error: 'Your admin membership request is already submitted.' });
    }

    await prisma.join_us.create({
      data: {
        full_name: fullName || currentUser.name,
        email: currentUser.email,
        phone: phone || null,
        college_name: collegeName || null,
        course_stream: courseStream || null,
        year_of_study: yearOfStudy || null,
        skills: JSON.stringify(Array.isArray(skills) ? skills : []),
        interests: JSON.stringify(Array.isArray(interests) ? interests : []),
        motivation: motivation || null,
        github_url: githubUrl || null,
        linkedin_url: linkedinUrl || null,
        website_url: websiteUrl || null,
        team_preferences: JSON.stringify(Array.isArray(teamPreferences) ? teamPreferences : []),
        role_applied: 'admin',
        status: 'pending',
      }
    });

    try {
      await sendEmail(
        currentUser.email,
        'Your Technoverse Admin Application Was Submitted',
        emailTemplates.joinUs(fullName || currentUser.name)
      );
    } catch (emailErr) {
      console.warn('Email failed but data saved:', emailErr);
    }

    res.status(201).json({ message: 'Your application is submitted.' });
  } catch (error) {
    console.error('Error in joinUs:', error);
    res.status(500).json({
      error: 'Failed to save data',
      details: error.message,
    });
  }
};

const getJoinUsData = async (req, res) => {
  try {
    const requests = await prisma.join_us.findMany({
      where: { role_applied: 'admin' },
      orderBy: { created_at: 'desc' },
    });

    const data = await attachMatchedUsers(requests);
    res.status(200).json(data || []);
  } catch (error) {
    console.error('Error in getJoinUsData:', error);
    res.status(500).json({
      error: 'Failed to fetch data from join_us table',
      details: error.message,
    });
  }
};

const approveJoinUsRequest = async (req, res) => {
  try {
    const requestId = Number(req.params.id);
    const request = await prisma.join_us.findUnique({
      where: { id: requestId },
    });

    if (!request || request.role_applied !== 'admin') {
      return res.status(404).json({ error: 'Admin application not found.' });
    }

    const matchedUser = await prisma.users.findUnique({
      where: { email: request.email },
    });

    if (!matchedUser) {
      return res.status(400).json({ error: 'Applicant must have an existing logged-in account before approval.' });
    }

    await prisma.$transaction([
      prisma.join_us.update({
        where: { id: requestId },
        data: { status: 'approved' },
      }),
      prisma.users.update({
        where: { id: matchedUser.id },
        data: {
          adminAccess: true,
          superAdminAccess: matchedUser.superAdminAccess || matchedUser.email === SUPER_ADMIN_EMAIL,
        },
      }),
    ]);

    res.json({ message: 'Admin membership approved successfully.' });
  } catch (error) {
    console.error('approveJoinUsRequest error:', error);
    res.status(500).json({ error: 'Failed to approve admin request', details: error.message });
  }
};

const rejectJoinUsRequest = async (req, res) => {
  try {
    const requestId = Number(req.params.id);

    await prisma.join_us.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    });

    res.json({ message: 'Admin membership request rejected.' });
  } catch (error) {
    console.error('rejectJoinUsRequest error:', error);
    res.status(500).json({ error: 'Failed to reject admin request', details: error.message });
  }
};

const getAdminMembers = async (req, res) => {
  try {
    const admins = await prisma.users.findMany({
      where: {
        OR: [
          { adminAccess: true },
          { superAdminAccess: true },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        appliedRole: true,
        applicationStatus: true,
        adminAccess: true,
        superAdminAccess: true,
        created_at: true,
      },
      orderBy: [
        { superAdminAccess: 'desc' },
        { created_at: 'desc' },
      ],
    });

    res.json(admins);
  } catch (error) {
    console.error('getAdminMembers error:', error);
    res.status(500).json({ error: 'Failed to fetch admin members', details: error.message });
  }
};

const removeAdminCapability = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (req.user.id === userId) {
      return res.status(400).json({ error: 'Super admin cannot remove their own access here.' });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        superAdminAccess: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Admin member not found.' });
    }

    if (user.superAdminAccess) {
      return res.status(403).json({ error: 'Super admin access cannot be removed from this screen.' });
    }

    await prisma.users.update({
      where: { id: userId },
      data: {
        adminAccess: false,
      },
    });

    res.json({ message: 'Admin access removed successfully.' });
  } catch (error) {
    console.error('removeAdminCapability error:', error);
    res.status(500).json({ error: 'Failed to remove admin access', details: error.message });
  }
};

module.exports = {
  joinUs,
  getJoinUsData,
  approveJoinUsRequest,
  rejectJoinUsRequest,
  getAdminMembers,
  removeAdminCapability,
};
