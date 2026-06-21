// src/utils/notify.js
// Helper to persist notifications and push them in real-time over socket.io.
// `io` is obtained in controllers via req.app.get('io').

const prisma = require('../../prisma/client');

/**
 * Create one notification for a single user and emit it over socket.
 */
async function notifyUser(io, userId, { type, title, message = null, link = null }) {
  try {
    const notification = await prisma.notifications.create({
      data: { userId, type, title, message, link },
    });
    if (io) io.to(`user_${userId}`).emit('notification', notification);
    return notification;
  } catch (err) {
    console.error('notifyUser error:', err.message);
    return null;
  }
}

/**
 * Create the same notification for many users (bulk insert) and emit to each.
 */
async function notifyUsers(io, userIds, { type, title, message = null, link = null }) {
  const ids = [...new Set(userIds)].filter(Boolean);
  if (ids.length === 0) return;
  try {
    await prisma.notifications.createMany({
      data: ids.map((userId) => ({ userId, type, title, message, link })),
    });
    if (io) {
      // createMany doesn't return rows, so emit a lightweight payload.
      const payload = { type, title, message, link, read: false, created_at: new Date() };
      ids.forEach((userId) => io.to(`user_${userId}`).emit('notification', { ...payload, userId }));
    }
  } catch (err) {
    console.error('notifyUsers error:', err.message);
  }
}

/**
 * Notify every approved user that has applied for a given role ('student' | 'alumni').
 * Pass excludeUserId to skip the actor (e.g. the admin/poster).
 */
async function notifyByRole(io, role, payload, excludeUserId = null) {
  try {
    const users = await prisma.users.findMany({
      where: {
        appliedRole: role,
        ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
      },
      select: { id: true },
    });
    await notifyUsers(io, users.map((u) => u.id), payload);
  } catch (err) {
    console.error('notifyByRole error:', err.message);
  }
}

module.exports = { notifyUser, notifyUsers, notifyByRole };
