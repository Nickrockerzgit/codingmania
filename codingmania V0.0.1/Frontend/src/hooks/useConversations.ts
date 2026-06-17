import { useState, useEffect, useCallback } from "react";
import { fetchConversations } from "../api/chatApi";
import { Conversation, Message } from "./useChat";

const sortConversations = (items: Conversation[]) =>
  [...items].sort((a, b) => {
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bTime - aTime;
  });

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchConversations();
      setConversations(sortConversations(data));
    } catch (e: any) {
      setError(e?.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refetch = () => {
    load();
  };

  const upsertConversation = (conversation: Conversation) => {
    setConversations((prev) => {
      const existing = prev.find((item) => item.id === conversation.id);
      const next = existing
        ? prev.map((item) => (item.id === conversation.id ? conversation : item))
        : [conversation, ...prev];

      return sortConversations(next);
    });
  };

  const updateConversationPreview = (conversationId: number, message: Message) => {
    setConversations((prev) => {
      const next = prev.map((item) =>
        item.id === conversationId
          ? {
              ...item,
              lastMessage: message,
              lastMessageAt: message.createdAt ?? item.lastMessageAt ?? null,
            }
          : item
      );

      return sortConversations(next);
    });
  };

  return {
    conversations,
    loading,
    error,
    refetch,
    upsertConversation,
    updateConversationPreview,
  };
};

export default useConversations;
