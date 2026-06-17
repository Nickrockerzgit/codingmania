import React from "react";
import { Conversation } from "../../hooks/useChat";
import ConversationItem from "./ConversationItem";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: number | null;
  onSelectConversation: (conversation: Conversation) => void;
  loading?: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-500">
        <p className="text-sm">No conversations yet</p>
        <p className="text-xs mt-1">Start chatting with alumni!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isActive={conv.id === activeConversationId}
          onClick={() => onSelectConversation(conv)}
        />
      ))}
    </div>
  );
};

export default ConversationList;
