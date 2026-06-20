import React, { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  disabled?: boolean;
  onSend: (content: string) => void;
  sending?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  disabled,
  onSend,
  sending,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || disabled || sending) return;
    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/10 bg-[#0a0a0a] p-4">
      <div className="flex items-end gap-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Select a conversation…" : "Type your message…"}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm disabled:bg-white/5 disabled:text-gray-500"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled || sending}
          className="p-3 bg-red-600 text-white rounded-2xl disabled:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
        >
          {sending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
