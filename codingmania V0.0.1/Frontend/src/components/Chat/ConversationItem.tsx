import React from "react";
import { Conversation } from "../../hooks/useChat";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const otherUser = conversation.otherUser;
  const lastMessage = conversation.lastMessage;

  const getAvatar = () => {
    if (otherUser?.avatar) {
      return otherUser.avatar;
    }
    return null;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const avatar = getAvatar();
  const initials = getInitials(otherUser?.name || "User");
  const previewContent = String(lastMessage?.content || lastMessage?.text || "").trim();
  const previewText = previewContent
    ? previewContent.length > 32
      ? `${previewContent.slice(0, 29).trimEnd()}...`
      : previewContent
    : "No messages yet";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
        isActive
          ? "bg-red-500/10 border-l-2 border-red-500"
          : "hover:bg-white/5 border border-transparent"
      }`}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={otherUser?.name}
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
      ) : null}
      <div
        className={`${
          avatar ? "hidden" : ""
        } w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center text-white font-bold text-sm`}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-white truncate">{otherUser?.name}</p>
          <span className="text-xs text-gray-400">
            {formatTime(conversation.lastMessageAt || undefined)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-300 truncate">{previewText}</p>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              otherUser?.role === "alumni"
                ? "bg-purple-500/20 text-purple-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {otherUser?.role === "alumni" ? "Alumni" : "Student"}
          </span>
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
