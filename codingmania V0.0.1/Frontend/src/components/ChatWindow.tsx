
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

const ChatWindow = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm TechnoBot. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    const userMessage = input.trim();
    if (!userMessage) return;

    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.vite_api_base_url}/chat`, {
        prompt: userMessage,
      });

      const reply = res.data.reply;

      setMessages([...updatedMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("API Error:", err);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "⚠️ Failed to get AI response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-[90%] max-w-sm md:w-96 h-[80vh] md:h-96 bg-white shadow-2xl rounded-lg flex flex-col z-[9999] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm font-semibold flex justify-between items-center">
        <span>TechnoBot AI</span>
        <button onClick={onClose} className="text-xl leading-none hover:text-gray-300">×</button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded whitespace-pre-wrap ${
              m.role === "user" ? "bg-purple-100 text-right" : "bg-white"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <div className="text-gray-400">TechnoBot is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask something..."
          className="flex-1 text-sm px-3 py-2 border rounded outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 text-sm disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
