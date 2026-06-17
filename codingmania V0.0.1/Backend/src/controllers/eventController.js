// //imagkit version 
// const prisma = require('../../prisma/client');
// const imagekit = require('../config/imagekit');

// // Upload single event image to ImageKit
// const uploadEventImage = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No image file provided" });

//     const result = await imagekit.upload({
//       file: req.file.buffer,
//       fileName: `event_${Date.now()}`,
//       folder: "/uploads/events"
//     });

//     res.json({ imageUrl: result.url, fileId: result.fileId });
//   } catch (error) {
//     console.error("Upload Error:", error);
//     res.status(500).json({ message: "Error uploading image" });
//   }
// };

// // Update all events
// const updateEvents = async (req, res) => {
//   try {
//     const { events } = req.body;

//     const existingEvents = await prisma.events.findMany();
//     await prisma.events.deleteMany();

//     // delete old images
//     for (const e of existingEvents) {
//       if (e.fileId) {
//         try { await imagekit.deleteFile(e.fileId); }
//         catch (err) { console.error("Delete fail:", err.message); }
//       }
//     }

//     const newEvents = await prisma.$transaction(
//       events.map(event =>
//         prisma.events.create({
//           data: {
//              title: event.title,
//         date: event.date ? new Date(event.date) : null,  // ✅ FIXED

//         location: event.location,
//         participants: event.participants,
//         image: event.imageUrl,
//         fileId: event.fileId,

//         prize_pool: event.prize_pool,
//         entry_fee: event.entry_fee,
//         categories: event.categories,
//         about: event.about,
//         rules_guidelines: event.rules_guidelines,

//         registration_start: event.registration_start ? new Date(event.registration_start) : null,
//         registration_end: event.registration_end ? new Date(event.registration_end) : null,
//         event_start: event.event_start ? new Date(event.event_start) : null,
//         event_end: event.event_end ? new Date(event.event_end) : null
//           }
//         })
//       )
//     );

//     res.status(200).json({ message: "Events updated", count: newEvents.length });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const getEvents = async (req, res) => {
//   const events = await prisma.events.findMany({ orderBy: { id: 'asc' } });
//   res.json(events);
// };

// const getEvent = async (req, res) => {
//   const event = await prisma.events.findUnique({ where: { id: parseInt(req.params.id) } });
//   res.json(event);
// };

// const deleteEvent = async (req, res) => {
//   const event = await prisma.events.findUnique({ where: { id: parseInt(req.params.id) } });
//   if (event?.fileId) await imagekit.deleteFile(event.fileId);
//   await prisma.events.delete({ where: { id: parseInt(req.params.id) } });
//   res.json({ message: "Deleted" });
// };

// module.exports = { uploadEventImage, updateEvents, getEvents, getEvent, deleteEvent };















// Event Controller - Updated with registration_open
const prisma = require('../../prisma/client');
const imagekit = require('../config/imagekit');

// Upload single event image to ImageKit
const uploadEventImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file provided" });

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `event_${Date.now()}`,
      folder: "/uploads/events"
    });

    res.json({ imageUrl: result.url, fileId: result.fileId });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Error uploading image" });
  }
};

// Update all events
const updateEvents = async (req, res) => {
  try {
    const { events } = req.body;

    const existingEvents = await prisma.events.findMany();
    await prisma.events.deleteMany();

    // delete old images
    for (const e of existingEvents) {
      if (e.fileId) {
        try { await imagekit.deleteFile(e.fileId); }
        catch (err) { console.error("Delete fail:", err.message); }
      }
    }

    const newEvents = await prisma.$transaction(
      events.map(event =>
        prisma.events.create({
          data: {
            title: event.title,
            date: event.date ? new Date(event.date) : null,
            location: event.location,
            participants: event.participants,
            image: event.imageUrl,
            fileId: event.fileId,
            prize_pool: event.prize_pool,
            entry_fee: event.entry_fee,
            categories: event.categories,
            about: event.about,
            rules_guidelines: event.rules_guidelines,
            registration_start: event.registration_start ? new Date(event.registration_start) : null,
            registration_end: event.registration_end ? new Date(event.registration_end) : null,
            event_start: event.event_start ? new Date(event.event_start) : null,
            event_end: event.event_end ? new Date(event.event_end) : null,
            registration_open: event.registration_open ?? true,  // NEW FIELD
          }
        })
      )
    );

    res.status(200).json({ message: "Events updated", count: newEvents.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getEvents = async (req, res) => {
  const events = await prisma.events.findMany({ orderBy: { id: 'asc' } });
  res.json(events);
};

const getEvent = async (req, res) => {
  const event = await prisma.events.findUnique({ where: { id: parseInt(req.params.id) } });
  res.json(event);
};

const deleteEvent = async (req, res) => {
  const event = await prisma.events.findUnique({ where: { id: parseInt(req.params.id) } });
  if (event?.fileId) await imagekit.deleteFile(event.fileId);
  await prisma.events.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ message: "Deleted" });
};

// Alumni Events (new)
const eventService = require('../services/eventService');

const createAlumniEvent = async (req, res) => {
  try {
    const creatorId = req.user.id;
    const event = await eventService.createEvent(creatorId, req.body);
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: error.message || 'Failed to create event' });
  }
};

const getAllAlumniEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

const getMyAlumniEvents = async (req, res) => {
  try {
    const creatorId = req.user.id;
    const events = await eventService.getMyEvents(creatorId);
    res.json(events);
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ message: 'Failed to fetch your events' });
  }
};

const updateAlumniEvent = async (req, res) => {
  try {
    const creatorId = req.user.id;
    const eventId = parseInt(req.params.id);
    const event = await eventService.updateEvent(eventId, creatorId, req.body);
    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: error.message || 'Failed to update event' });
  }
};

const deleteAlumniEvent = async (req, res) => {
  try {
    const creatorId = req.user.id;
    const eventId = parseInt(req.params.id);
    await eventService.deleteEvent(eventId, creatorId);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: error.message || 'Failed to delete event' });
  }
};

module.exports = { 
  uploadEventImage, 
  updateEvents, 
  getEvents, 
  getEvent, 
  deleteEvent,
  createAlumniEvent,
  getAllAlumniEvents,
  getMyAlumniEvents,
  updateAlumniEvent,
  deleteAlumniEvent,
};


