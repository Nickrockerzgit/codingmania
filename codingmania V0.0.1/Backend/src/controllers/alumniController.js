const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createAlumniTask = async (req, res) => {
  try {
    const { title, description, deadline, priority, status = 'pending', progress = 0, userId } = req.body;

    const task = await prisma.alumni_tasks.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        priority,
        status,
        progress,
        userId,
      },
    });

    res.json(task);
  } catch (error) {
    console.error('Create alumni task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.getAlumniTasks = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const tasks = await prisma.alumni_tasks.findMany({
      where: { userId: Number(userId) },
      orderBy: { created_at: 'desc' },
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get alumni tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

exports.updateAlumniTask = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const task = await prisma.alumni_tasks.update({
      where: { id: Number(id) },
      data,
    });

    res.json(task);
  } catch (error) {
    console.error('Update alumni task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.deleteAlumniTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.alumni_tasks.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete alumni task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

exports.getAlumniProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    let profile = await prisma.alumni_profiles.findUnique({
      where: { userId: Number(userId) },
    });

    if (!profile) {
      profile = await prisma.alumni_profiles.create({
        data: { userId: Number(userId) },
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get alumni profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

exports.updateAlumniProfile = async (req, res) => {
  try {
    const { userId, ...data } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const profile = await prisma.alumni_profiles.upsert({
      where: { userId: Number(userId) },
      update: data,
      create: {
        userId: Number(userId),
        ...data,
      },
    });

    res.json(profile);
  } catch (error) {
    console.error('Update alumni profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.getAllAlumni = async (req, res) => {
  try {
    const alumniProfiles = await prisma.alumni_profiles.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    const alumni = alumniProfiles.map(profile => ({
      id: profile.id,
      userId: profile.userId,
      name: profile.user?.name || 'Alumni',
      email: profile.user?.email,
      avatar: profile.user?.avatar,
      imageUrl: profile.user?.avatar,
      batch: profile.batch,
      branch: profile.branch,
      company: profile.company,
      position: profile.position,
      bio: profile.bio,
      location: profile.location,
    }));

    res.json(alumni);
  } catch (error) {
    console.error('Get all alumni error:', error);
    res.status(500).json({ error: 'Failed to get alumni' });
  }
};