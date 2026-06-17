// src/controllers/userlistController.js   ← yeh file bana ya replace kar

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUserCount = async (req, res) => {
  try {
    const count = await prisma.users.count();
    res.json({ count });
  } catch (error) {
    console.error('getUserCount error:', error);
    res.status(500).json({ error: 'Failed to get count', details: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ error: 'Failed to get users', details: error.message });
  }
};

const applyForRole = async (req, res) => {
  try {
    const { role, yearOfStudy, branch, collegeName, githubUrl, websiteUrl, bio, company, position, batch } = req.body;
    const email = req.user.email;

    if (role === 'admin') {
      return res.status(400).json({
        error: 'Admin membership is only available through the Join Technoverse application flow',
      });
    }

    const currentUser = await prisma.users.findUnique({
      where: { email },
      select: { appliedRole: true, role: true }
    });

    if (currentUser?.appliedRole) {
      if (currentUser.appliedRole === 'student' && role === 'alumni') {
        return res.status(400).json({ error: 'You have already applied as a student' });
      }
      if (currentUser.appliedRole === 'alumni' && role === 'student') {
        return res.status(400).json({ error: 'You have already applied as an alumni' });
      }
      if (currentUser.appliedRole === role) {
        return res.status(400).json({ error: `You have already applied as a ${role}` });
      }
    }

    const updateData = {
      role: role,
      appliedRole: role,
      applicationStatus: 'approved',
    };

    if (role === 'student') {
      Object.assign(updateData, {
        yearOfStudy,
        branch,
        collegeName,
        githubUrl,
        websiteUrl,
        bio,
      });
    } else if (role === 'alumni') {
      Object.assign(updateData, {
        company,
        position,
        batch,
        branch,
        bio,
      });
    }

    const user = await prisma.users.update({
      where: { email },
      data: updateData,
    });

    res.json({ message: 'Application submitted successfully', user });
  } catch (error) {
    console.error('applyForRole error:', error);
    res.status(500).json({ error: 'Failed to submit application', details: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        location: true,
        avatar: true,
        role: true,
        applicationStatus: true,
        appliedRole: true,
        yearOfStudy: true,
        branch: true,
        collegeName: true,
        githubUrl: true,
        websiteUrl: true,
        company: true,
        position: true,
        batch: true,
        created_at: true,
      },
    });
    res.json({ data: user });
  } catch (error) {
    console.error('getCurrentUser error:', error);
    res.status(500).json({ error: 'Failed to get user', details: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, location, yearOfStudy, branch, collegeName, githubUrl, websiteUrl, company, position, batch } = req.body;
    const email = req.user.email;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (location) updateData.location = location;
    if (yearOfStudy) updateData.yearOfStudy = yearOfStudy;
    if (branch) updateData.branch = branch;
    if (collegeName) updateData.collegeName = collegeName;
    if (githubUrl) updateData.githubUrl = githubUrl;
    if (websiteUrl) updateData.websiteUrl = websiteUrl;
    if (company) updateData.company = company;
    if (position) updateData.position = position;
    if (batch) updateData.batch = batch;

    const user = await prisma.users.update({
      where: { email },
      data: updateData,
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
};

module.exports = { getUserCount, getAllUsers, applyForRole, getCurrentUser, updateProfile };
