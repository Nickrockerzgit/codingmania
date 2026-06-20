import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { useConversations } from "../../hooks/useConversations";
import { Conversation, Message } from "../../hooks/useChat";
import { createConversation, mapConversationResponse } from "../../api/chatApi";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../AuthContext";

interface ChatLayoutProps {
  initialTargetUserId?: string | null;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ initialTargetUserId }) => {
  const { user } = useAuth();
  const { conversations, loading, upsertConversation, updateConversationPreview } =
    useConversations();
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialTargetUserId) {
      return;
    }

    const targetId = Number(initialTargetUserId);
    if (!targetId || !user?.id) {
      return;
    }

    const found = conversations.find((c) => c.otherUser.id === targetId);
    if (found) {
      setConversationError(null);
      setActiveConversation(found);
      return;
    }

    if (loading) {
      return;
    }

    let cancelled = false;

    const startConversation = async () => {
      setIsStartingConversation(true);
      setConversationError(null);

      try {
        const rawConversation = await createConversation(targetId);
        if (cancelled) return;

        const mappedConversation = mapConversationResponse(rawConversation, user.id!);
        upsertConversation(mappedConversation);
        setActiveConversation(mappedConversation);
      } catch (error: any) {
        if (!cancelled) {
          setConversationError(error?.message || "Failed to open conversation");
        }
      } finally {
        if (!cancelled) {
          setIsStartingConversation(false);
        }
      }
    };

    startConversation();

    return () => {
      cancelled = true;
    };
  }, [initialTargetUserId, conversations, loading, upsertConversation, user?.id]);

  const handleSelectConversation = (conv: Conversation) => {
    setConversationError(null);
    setActiveConversation(conv);
  };

  const handleConversationActivity = (conversationId: number, message: Message) => {
    updateConversationPreview(conversationId, message);

    setActiveConversation((prev) =>
      prev?.id === conversationId
        ? {
            ...prev,
            lastMessage: message,
            lastMessageAt: message.createdAt ?? prev.lastMessageAt ?? null,
          }
        : prev
    );
  };

  return (
    <div className="flex h-full gap-4">
      {/* Conversation List */}
      <div className="w-80 flex-shrink-0 bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-red-400" />
          <h2 className="font-bold text-white">Messages</h2>
        </div>
        {conversationError && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {conversationError}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversation?.id}
            onSelectConversation={handleSelectConversation}
            loading={loading || isStartingConversation}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 min-w-0">
        <ChatWindow
          conversation={activeConversation}
          onConversationActivity={handleConversationActivity}
        />
      </div>
    </div>
  );
};

export default ChatLayout;
