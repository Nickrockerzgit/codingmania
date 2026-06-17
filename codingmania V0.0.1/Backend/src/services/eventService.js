const prisma = require('../../prisma/client');

const createEvent = async (creatorId, data) => {
  const event = await prisma.event.create({
    data: {
      title: data.title,
      type: data.type,
      date: new Date(data.date),
      endDate: new Date(data.endDate),
      organizer: data.organizer,
      tags: data.tags ? data.tags.join(',') : null,
      status: data.status || 'upcoming',
      description: data.description,
      link: data.link,
      creatorId,
    },
  });

  return {
    ...event,
    tags: event.tags ? event.tags.split(',') : [],
  };
};

const getAllEvents = async () => {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      creator: {
        select: { id: true, name: true },
      },
    },
  });

  return events.map(event => ({
    ...event,
    tags: event.tags ? event.tags.split(',') : [],
  }));
};

const getMyEvents = async (creatorId) => {
  const events = await prisma.event.findMany({
    where: { creatorId },
    orderBy: { createdAt: 'desc' },
  });

  return events.map(event => ({
    ...event,
    tags: event.tags ? event.tags.split(',') : [],
  }));
};

const updateEvent = async (eventId, creatorId, data) => {
  const existing = await prisma.event.findFirst({
    where: { id: eventId, creatorId },
  });

  if (!existing) {
    throw new Error('Event not found or unauthorized');
  }

  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      title: data.title,
      type: data.type,
      date: data.date ? new Date(data.date) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      organizer: data.organizer,
      tags: data.tags ? data.tags.join(',') : undefined,
      status: data.status,
      description: data.description,
      link: data.link,
    },
  });

  return {
    ...event,
    tags: event.tags ? event.tags.split(',') : [],
  };
};

const deleteEvent = async (eventId, creatorId) => {
  const existing = await prisma.event.findFirst({
    where: { id: eventId, creatorId },
  });

  if (!existing) {
    throw new Error('Event not found or unauthorized');
  }

  await prisma.event.delete({
    where: { id: eventId },
  });

  return { message: 'Event deleted successfully' };
};

module.exports = {
  createEvent,
  getAllEvents,
  getMyEvents,
  updateEvent,
  deleteEvent,
};