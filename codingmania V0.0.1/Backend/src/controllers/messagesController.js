const chatService = require("../service/chatService");

const createConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ error: "targetUserId is required" });
    }

    const conversation = await chatService.createOrGetConversation(
      currentUserId,
      Number(targetUserId)
    );

    res.json(conversation);
  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(400).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const messages = await chatService.getMessages(
      Number(conversationId),
      userId
    );

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(400).json({ error: error.message });
  }
};

const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await chatService.getUserConversations(userId);

    res.json(conversations);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(400).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { targetUserId, content, conversationId } = req.body;

    let targetId = targetUserId;

    // If conversationId provided, get targetUserId from conversation
    if (conversationId && !targetUserId) {
      const prisma = require('../../prisma/client');
      const participants = await prisma.conversation_participant.findMany({
        where: { conversationId: Number(conversationId) },
      });
      const other = participants.find(p => p.userId !== senderId);
      if (other) targetId = other.userId;
    }

    if (!targetId) {
      return res.status(400).json({ error: "targetUserId is required" });
    }

    const result = await chatService.sendMessage(senderId, Number(targetId), content);

    res.json(result);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createConversation,
  getMessages,
  getUserConversations,
  sendMessage,
};
