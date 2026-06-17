const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createStudentTask = async (req, res) => {
  try {
    const { title, description, deadline, priority, status = 'pending', progress = 0, userId } = req.body;

    const task = await prisma.student_tasks.create({
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
    console.error('Create student task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.getStudentTasks = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const tasks = await prisma.student_tasks.findMany({
      where: { userId: Number(userId) },
      orderBy: { created_at: 'desc' },
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get student tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

exports.updateStudentTask = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const task = await prisma.student_tasks.update({
      where: { id: Number(id) },
      data,
    });

    res.json(task);
  } catch (error) {
    console.error('Update student task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.deleteStudentTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.student_tasks.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete student task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

exports.createStudentRoadmap = async (req, res) => {
  try {
    const { title, description, category, difficulty = 'beginner', duration, authorId } = req.body;

    const roadmap = await prisma.student_roadmaps.create({
      data: {
        title,
        description,
        category,
        difficulty,
        duration,
        authorId,
      },
      include: {
        steps: true,
      },
    });

    res.json(roadmap);
  } catch (error) {
    console.error('Create student roadmap error:', error);
    res.status(500).json({ error: 'Failed to create roadmap' });
  }
};

exports.getStudentRoadmaps = async (req, res) => {
  try {
    const { authorId } = req.query;

    const where = authorId ? { authorId: Number(authorId) } : {};

    const roadmaps = await prisma.student_roadmaps.findMany({
      where,
      include: {
        steps: {
          orderBy: { step_order: 'asc' },
        },
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json(roadmaps);
  } catch (error) {
    console.error('Get student roadmaps error:', error);
    res.status(500).json({ error: 'Failed to get roadmaps' });
  }
};

exports.getStudentRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;

    const roadmap = await prisma.student_roadmaps.findUnique({
      where: { id: Number(id) },
      include: {
        steps: {
          orderBy: { step_order: 'asc' },
        },
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    res.json(roadmap);
  } catch (error) {
    console.error('Get student roadmap error:', error);
    res.status(500).json({ error: 'Failed to get roadmap' });
  }
};

exports.updateStudentRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const roadmap = await prisma.student_roadmaps.update({
      where: { id: Number(id) },
      data,
      include: {
        steps: true,
      },
    });

    res.json(roadmap);
  } catch (error) {
    console.error('Update student roadmap error:', error);
    res.status(500).json({ error: 'Failed to update roadmap' });
  }
};

exports.deleteStudentRoadmap = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.student_roadmaps.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Roadmap deleted' });
  } catch (error) {
    console.error('Delete student roadmap error:', error);
    res.status(500).json({ error: 'Failed to delete roadmap' });
  }
};

exports.addRoadmapStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link, step_order } = req.body;

    const step = await prisma.student_roadmap_step.create({
      data: {
        roadmapId: Number(id),
        title,
        description,
        link,
        step_order,
      },
    });

    res.json(step);
  } catch (error) {
    console.error('Add roadmap step error:', error);
    res.status(500).json({ error: 'Failed to add step' });
  }
};

exports.updateRoadmapStep = async (req, res) => {
  try {
    const { roadmapId, stepId } = req.params;
    const data = req.body;

    const step = await prisma.student_roadmap_step.update({
      where: { id: Number(stepId) },
      data,
    });

    res.json(step);
  } catch (error) {
    console.error('Update roadmap step error:', error);
    res.status(500).json({ error: 'Failed to update step' });
  }
};

exports.deleteRoadmapStep = async (req, res) => {
  try {
    const { stepId } = req.params;

    await prisma.student_roadmap_step.delete({
      where: { id: Number(stepId) },
    });

    res.json({ message: 'Step deleted' });
  } catch (error) {
    console.error('Delete roadmap step error:', error);
    res.status(500).json({ error: 'Failed to delete step' });
  }
};

exports.getRoadmapProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: 'studentId required' });
    }

    const progress = await prisma.student_roadmap_progress.findMany({
      where: {
        roadmapId: Number(id),
        studentId: Number(studentId),
      },
      include: {
        step: true,
      },
    });

    res.json(progress);
  } catch (error) {
    console.error('Get roadmap progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
};

exports.updateRoadmapProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, stepId, completed } = req.body;

    const progress = await prisma.student_roadmap_progress.upsert({
      where: {
        studentId_stepId: {
          studentId: Number(studentId),
          stepId: Number(stepId),
        },
      },
      update: { completed },
      create: {
        studentId: Number(studentId),
        roadmapId: Number(id),
        stepId: Number(stepId),
        completed,
      },
    });

    res.json(progress);
  } catch (error) {
    console.error('Update roadmap progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    let profile = await prisma.student_profiles.findUnique({
      where: { userId: Number(userId) },
    });

    if (!profile) {
      profile = await prisma.student_profiles.create({
        data: { userId: Number(userId) },
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

exports.updateStudentProfile = async (req, res) => {
  try {
    const { userId, ...data } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const profile = await prisma.student_profiles.upsert({
      where: { userId: Number(userId) },
      update: data,
      create: {
        userId: Number(userId),
        ...data,
      },
    });

    res.json(profile);
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// New functions that use authenticated user from token
exports.getStudentProfileByAuth = async (req, res) => {
  try {
    const userId = req.user.id;

    let profile = await prisma.student_profiles.findUnique({
      where: { userId: userId },
    });

    if (!profile) {
      profile = await prisma.student_profiles.create({
        data: { userId: userId },
      });
    }

    res.json({ data: profile });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

exports.updateStudentProfileByAuth = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const profile = await prisma.student_profiles.upsert({
      where: { userId: userId },
      update: data,
      create: {
        userId: userId,
        ...data,
      },
    });

    res.json(profile);
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};