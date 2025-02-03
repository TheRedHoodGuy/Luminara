import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, Copy, Clock } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "This is a simulated response from Luminara AI. In a real implementation, this would be connected to your AI backend.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 p-4 hidden md:block">
        <Link to="/" className="block mb-6">
          <h1 className="text-xl font-semibold luminara-gradient">
            Luminara AI
          </h1>
        </Link>
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-500">Recent Chats</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>No recent chats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isBot ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] md:max-w-[60%] p-4 rounded-lg message-transition
                  ${
                    message.isBot
                      ? "bg-gray-100 rounded-tl-none"
                      : "bg-gradient-to-r from-[#0051ff] to-[#ff0063] text-white rounded-tr-none"
                  }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">{message.content}</div>
                  {message.isBot && (
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.isBot ? "text-gray-500" : "text-white/80"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-4 rounded-lg rounded-tl-none">
                <div className="flex gap-1">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0051ff]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-3 bg-gradient-to-r from-[#0051ff] to-[#ff0063] text-white rounded-lg
                       disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
