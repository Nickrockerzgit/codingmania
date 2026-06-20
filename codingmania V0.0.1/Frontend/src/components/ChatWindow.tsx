
// import { useEffect, useRef, useState } from "react";
// import axios from "axios";

// const ChatWindow = ({ onClose }: { onClose: () => void }) => {
//   const [messages, setMessages] = useState([
//     { role: "assistant", content: "👋 Hi! I'm TechnoBot. How can I help you today?" },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   const sendMessage = async () => {
//     const userMessage = input.trim();
//     if (!userMessage) return;

//     const updatedMessages = [...messages, { role: "user", content: userMessage }];
//     setMessages(updatedMessages);
//     setInput("");
//     setLoading(true);

//     try {
//       // ✅ Send just `prompt` to Gemini API
//       const res = await axios.post("${import.meta.env.vite_api_base_url}/chat", {
//         prompt: userMessage,
//       });

//       const reply = res.data.reply;

//       setMessages([...updatedMessages, { role: "assistant", content: reply }]);
//     } catch (err) {
//       console.error("API Error:", err);
//       setMessages([
//         ...updatedMessages,
//         { role: "assistant", content: "⚠️ Failed to get AI response." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed bottom-20 right-4 w-80 h-96 bg-white shadow-2xl rounded-lg flex flex-col z-[9999] overflow-hidden">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm font-semibold flex justify-between">
//         <span>TechnoBot AI</span>
//         <button onClick={onClose}>×</button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2 bg-gray-50">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`p-2 rounded whitespace-pre-wrap ${
//               m.role === "user" ? "bg-purple-100 text-right" : "bg-white"
//             }`}
//           >
//             {m.content}
//           </div>
//         ))}
//         {loading && <div className="text-gray-400">TechnoBot is typing...</div>}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="p-2 border-t bg-white flex items-center gap-2">
//         <input
//           type="text"
//           placeholder="Ask something..."
//           className="flex-1 text-sm px-3 py-2 border rounded"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button
//           onClick={sendMessage}
//           disabled={loading}
//           className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 text-sm"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;












import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Bot, Send, X } from "lucide-react";

const ChatWindow = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm TechnoBot. Ask me anything about the TechnoVerse club & website." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

  const sendMessage = async () => {
    const userMessage = input.trim();
    if (!userMessage || loading) return;

    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
        prompt: userMessage,
      });

      const reply = res.data?.reply || "Sorry, I couldn't generate a response.";
      setMessages([...updatedMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("API Error:", err);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 w-[90%] max-w-sm md:w-96 h-[70vh] md:h-[28rem] bg-[#0a0a0a] border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)] rounded-2xl flex flex-col z-[9999] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">TechnoBot AI</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto text-sm space-y-3 bg-[#050505]">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-red-600 text-white rounded-br-sm"
                  : "bg-white/10 text-gray-100 rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-gray-300 px-3 py-2 rounded-2xl rounded-bl-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t border-white/10 bg-[#0a0a0a] flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask about TechnoVerse..."
          className="flex-1 text-sm px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-lg outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-2 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
