import React from "react";

interface Message {
  id: number | string;
  content: string;
  senderId: number;
  sender?: { id: number; name: string };
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMine }) => {
  const content = message?.content ?? "";
  const senderName = message?.sender?.name || (isMine ? "You" : "User");
  const time = message?.createdAt
    ? new Date(message.createdAt).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
          isMine
            ? "bg-indigo-600 text-white rounded-br-md"
            : "bg-white text-gray-900 border border-gray-100 rounded-bl-md"
        }`}
      >
        {!isMine && (
          <p className="text-xs font-semibold text-indigo-600 mb-1">
            {senderName}
          </p>
        )}
        <p className="text-sm break-words">{content}</p>
        <p
          className={`text-[10px] mt-1 ${
            isMine ? "text-indigo-200" : "text-gray-400"
          }`}
        >
          {time}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
