// src/controllers/webinarController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllWebinars = async (req, res) => {
  try {
    const webinars = await prisma.webinars.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(webinars);
  } catch (error) {
    console.error('Get webinars error:', error);
    res.status(500).json({ error: 'Failed to get webinars' });
  }
};

exports.createWebinar = async (req, res) => {
  try {
    const { title, description, date, time, mode, host, type, place, link, capacity } = req.body;

    if (!title || !date || !time || !mode || !host || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const webinar = await prisma.webinars.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        mode,
        host,
        type,
        place: mode === 'offline' ? place : null,
        link: mode === 'online' ? link : null,
        capacity: capacity ? parseInt(capacity) : null,
      },
    });

    res.json(webinar);
  } catch (error) {
    console.error('Create webinar error:', error);
    res.status(500).json({ error: 'Failed to create webinar' });
  }
};

exports.registerForWebinar = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming authenticateToken middleware

    const webinar = await prisma.webinars.findUnique({ where: { id: parseInt(id) } });
    if (!webinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    if (webinar.capacity) {
      const registeredCount = await prisma.webinar_attendances.count({
        where: { webinarId: parseInt(id), status: 'registered' },
      });
      if (registeredCount >= webinar.capacity) {
        return res.status(400).json({ error: 'No slots available' });
      }
    }

    const existing = await prisma.webinar_attendances.findUnique({
      where: { webinarId_userId: { webinarId: parseInt(id), userId } },
    });
    if (existing) {
      return res.status(400).json({ error: 'Already registered' });
    }

    const attendance = await prisma.webinar_attendances.create({
      data: {
        webinarId: parseInt(id),
        userId,
      },
    });

    res.json(attendance);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { attendanceId, status } = req.body;

    if (!['attended', 'missed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const attendance = await prisma.webinar_attendances.update({
      where: { id: attendanceId },
      data: { status },
    });

    res.json(attendance);
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
};

exports.getUserWebinars = async (req, res) => {
  try {
    const userId = req.user.id;

    const webinars = await prisma.webinars.findMany({
      orderBy: { date: 'desc' },
    });

    const attendances = await prisma.webinar_attendances.findMany({
      where: { userId },
    });

    const attendanceMap = {};
    attendances.forEach(att => {
      attendanceMap[att.webinarId] = att.status;
    });

    const now = new Date();

    const shapedEvents = webinars.map(webinar => {
      const status = attendanceMap[webinar.id] || (new Date(webinar.date) > now ? 'upcoming' : 'missed');
      const registeredCount = attendances.filter(att => att.webinarId === webinar.id && att.status === 'registered').length;

      return {
        id: webinar.id,
        title: webinar.title,
        description: webinar.description,
        date: webinar.date.toISOString().split('T')[0],
        time: webinar.time,
        location: webinar.mode === 'offline' ? webinar.place : 'Virtual Event',
        type: webinar.mode,
        status,
        organizer: webinar.host,
        capacity: webinar.capacity || 0,
        registered: registeredCount,
        category: webinar.type,
        meetingLink: webinar.link,
        registrationDate: attendances.find(att => att.webinarId === webinar.id)?.registrationDate.toISOString().split('T')[0] || '',
      };
    });

    res.json(shapedEvents);
  } catch (error) {
    console.error('Get user webinars error:', error);
    res.status(500).json({ error: 'Failed to get user webinars' });
  }
};

exports.getWebinarAttendances = async (req, res) => {
  try {
    const { id } = req.params;

    const attendances = await prisma.webinar_attendances.findMany({
      where: { webinarId: parseInt(id) },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(attendances);
  } catch (error) {
    console.error('Get attendances error:', error);
    res.status(500).json({ error: 'Failed to get attendances' });
  }
};