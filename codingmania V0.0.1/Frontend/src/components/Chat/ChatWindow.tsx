import React from "react";
import { useAuth } from "../AuthContext";
import useChat, { Conversation, Message } from "../../hooks/useChat";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface ChatWindowProps {
  conversation: Conversation | null;
  currentUserId?: number;
  onConversationActivity?: (conversationId: number, message: Message) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUserId,
  onConversationActivity,
}) => {
  const { user } = useAuth();
  const resolvedUserId = currentUserId ?? user?.id;

  const { messages, loading, error, sending, send } = useChat(
    conversation,
    onConversationActivity
  );
  
  const otherUser =
    conversation?.otherUser ?? null;

  const title = otherUser?.name || "Chat";
  const avatar = otherUser?.avatar || null;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      {conversation && (
        <div className="px-5 py-3 border-b border-gray-100 bg-white/60 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {avatar ? (
              <img
                src={avatar}
                alt={title}
                className="w-9 h-9 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=5b6ef5&color=fff&size=64`;
                }}
              />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-600">
                {title
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-bold text-gray-900 truncate">{title}</div>
              <div className="text-[11px] text-gray-400">
                {otherUser?.role === "alumni" ? "Alumni" : "Student"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <div className="text-center py-4 text-red-500 text-sm">{error}</div>
        )}
        {messages.map((m, idx) => (
          <MessageBubble
            key={m.id ?? `${m.senderId ?? "u"}_${m.createdAt ?? idx}`}
            message={m}
            isMine={String(m.senderId) === String(resolvedUserId)}
          />
        ))}
        {!conversation && !loading && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      <MessageInput
        disabled={!conversation}
        onSend={send}
        sending={sending}
      />
    </div>
  );
};

export default ChatWindow;
