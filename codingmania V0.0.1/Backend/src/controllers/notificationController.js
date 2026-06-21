// src/controllers/notificationController.js
const prisma = require('../../prisma/client');

// List the current user's notifications (most recent first)
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await prisma.notifications.findMany({
      where: { userId },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
    const unreadCount = await prisma.notifications.count({
      where: { userId, read: false },
    });
    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error('getMyNotifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await prisma.notifications.count({
      where: { userId: req.user.id, read: false },
    });
    res.json({ unreadCount });
  } catch (error) {
    console.error('getUnreadCount error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notifications.updateMany({
      where: { id: parseInt(id), userId: req.user.id },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('markAsRead error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await prisma.notifications.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('markAllAsRead error:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};
