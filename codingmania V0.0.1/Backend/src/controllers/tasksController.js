const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority, status = 'pending', progress = 0, userId } = req.body;

    const task = await prisma.tasks.create({
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
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const tasks = await prisma.tasks.findMany({
      where: { userId: Number(userId) },
      orderBy: { created_at: 'desc' },
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const task = await prisma.tasks.update({
      where: { id: Number(id) },
      data,
    });

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.tasks.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};













