import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { fetchMessages, sendMessageSocket } from "../api/chatApi";
import { connectSocket, getSocket } from "../socket/socket";

const MAX_MESSAGE_LENGTH = 2000;

export interface Message {
  id: number | string;
  content: string;
  text?: string;
  senderId: number;
  sender?: { id: number; name: string };
  conversationId: number;
  createdAt: string;
}

export interface Conversation {
  id: number;
  lastMessageAt?: string | null;
  lastMessage?: Message | null;
  otherUser: {
    id: number;
    name: string;
    role: string;
    branch?: string | null;
    batch?: string | null;
    avatar?: string | null;
  };
}

type ConversationActivityHandler = (conversationId: number, message: Message) => void;

export const useChat = (
  conversation: Conversation | null,
  onConversationActivity?: ConversationActivityHandler,
  onConversationsUpdate?: (conversations: Conversation[]) => void
) => {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const conversationId = conversation?.id ?? null;
  const targetUserId = useMemo(() => {
    if (!conversation) return null;
    return conversation.otherUser?.id ?? null;
  }, [conversation]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const conversationIdRef = useRef(conversationId);
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  const load = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || !conversationId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = getSocket() || connectSocket(token);
    if (!socket) return;

    const handleReceive = (payload: Message) => {
      const incomingConvId = payload?.conversationId;
      if (incomingConvId == null) return;
      onConversationActivity?.(incomingConvId, payload);
      if (String(incomingConvId) !== String(conversationIdRef.current)) return;

      setMessages((prev) => {
        const alreadyExists = prev.some(
          (m) => !String(m.id).startsWith("tmp_") && m.id === payload.id
        );
        if (alreadyExists) return prev;

        const withoutTemp = prev.filter(
          (m) =>
            !(
              String(m.id).startsWith("tmp_") &&
              m.content === payload.content &&
              String(m.senderId) === String(payload.senderId ?? payload.sender?.id)
            )
        );
        return [...withoutTemp, payload];
      });
    };

    const handleError = (data: { message: string }) => {
      console.error("Message error:", data.message);
      setMessages((prev) => prev.filter((m) => !String(m.id).startsWith("tmp_")));
      setError(data.message || "Failed to send message");
    };

    const handleReconnect = () => {
      load();
      const socket = getSocket();
      if (socket) {
        socket.emit("get_conversations");
      }
    };

    socket.on("receive_message", handleReceive);
    socket.on("message_error", handleError);
    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("message_error", handleError);
      socket.off("reconnect", handleReconnect);
    };
  }, [load, onConversationActivity]);

  const send = useCallback(
    async (content: string) => {
      if (!conversationId || !targetUserId) return;

      const trimmed = String(content || "").trim();
      if (!trimmed) return;

      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        setError(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`);
        return;
      }

      if (sending) return;

      setSending(true);
      setError(null);

      const tempId = `tmp_${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        content: trimmed,
        text: trimmed,
        senderId: currentUserId!,
        sender: { id: currentUserId!, name: user?.name || "You" },
        conversationId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      onConversationActivity?.(conversationId, optimisticMessage);

      try {
        sendMessageSocket({
          conversationId,
          targetUserId,
          content: trimmed,
        });
      } catch (e) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError("Failed to send message. Please try again.");
      } finally {
        setSending(false);
      }
    },
    [conversationId, targetUserId, currentUserId, user, sending, onConversationActivity]
  );

  return {
    messages,
    loading,
    error,
    sending,
    reload: load,
    send,
    targetUserId,
  };
};

export default useChat;
