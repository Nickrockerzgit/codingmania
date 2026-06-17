import { connectSocket, getSocket } from "../socket/socket";
import { Conversation } from "../hooks/useChat";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchConversations = async () => {
  const response = await fetch(`${API_BASE_URL}/messages/conversations`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch conversations");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createConversation = async (targetUserId: number) => {
  const response = await fetch(`${API_BASE_URL}/messages/conversation`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ targetUserId }),
  });
  if (!response.ok) throw new Error("Failed to create conversation");
  return response.json();
};

export const mapConversationResponse = (
  rawConversation: any,
  currentUserId: number
): Conversation => {
  const participants = Array.isArray(rawConversation?.participants)
    ? rawConversation.participants
    : [];

  const otherParticipant = participants.find(
    (participant: any) => Number(participant?.userId) !== Number(currentUserId)
  );

  const otherUser = otherParticipant?.user || {};
  const role = otherUser?.role || "student";
  const profile =
    role === "student" ? otherUser?.studentProfile : otherUser?.alumniProfile;

  return {
    id: rawConversation.id,
    lastMessageAt: rawConversation.lastMessageAt || null,
    lastMessage: rawConversation.lastMessage || null,
    otherUser: {
      id: otherUser.id,
      name: otherUser.name || "User",
      role,
      branch: profile?.branch || null,
      batch: profile?.batch || profile?.yearOfStudy || null,
      avatar: profile?.avatar || null,
    },
  };
};

export const fetchMessages = async (conversationId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/messages/conversation/${conversationId}/messages`,
    {
      headers: getAuthHeaders(),
    }
  );
  if (!response.ok) throw new Error("Failed to fetch messages");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const sendMessageSocket = ({
  conversationId,
  targetUserId,
  content,
}: {
  conversationId: number;
  targetUserId: number;
  content: string;
}) => {
  const socket = getSocket() || connectSocket(localStorage.getItem("token") || "");
  if (!socket) return;

  socket.emit("send_message", {
    conversationId,
    targetUserId,
    content,
  });
};
