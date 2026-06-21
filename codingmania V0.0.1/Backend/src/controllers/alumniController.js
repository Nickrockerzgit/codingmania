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
    // Alumni live on the users table (role/appliedRole = 'alumni') — this covers users
    // created via alumni signup and via the roll-number auto-assignment flow.
    const alumniUsers = await prisma.users.findMany({
      where: {
        OR: [{ role: 'alumni' }, { appliedRole: 'alumni' }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        batch: true,
        branch: true,
        company: true,
        position: true,
        bio: true,
        location: true,
      },
      orderBy: { name: 'asc' },
    });

    const alumni = alumniUsers.map(u => ({
      id: u.id,
      userId: u.id,
      name: u.name || 'Alumni',
      email: u.email,
      avatar: u.avatar,
      imageUrl: u.avatar,
      batch: u.batch,
      branch: u.branch,
      company: u.company,
      position: u.position,
      bio: u.bio,
      location: u.location,
    }));

    res.json(alumni);
  } catch (error) {
    console.error('Get all alumni error:', error);
    res.status(500).json({ error: 'Failed to get alumni' });
  }
};