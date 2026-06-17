const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messagesController");
const { authenticateToken } = require("../middleware/auth");

router.post("/conversation", authenticateToken, messagesController.createConversation);

router.get(
  "/conversation/:conversationId/messages",
  authenticateToken,
  messagesController.getMessages
);

router.get(
  "/conversations",
  authenticateToken,
  messagesController.getUserConversations
);

router.post("/message", authenticateToken, messagesController.sendMessage);

module.exports = router;
