import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatModelResponse } from "@/lib/textFormatting";

interface ChatMessageProps {
  text: string;
  sender: "user" | "bot";
}

const ChatMessage = ({ text, sender }: ChatMessageProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Message copied to clipboard",
    });
  };

  return (
    <div
      className={`chat-bubble ${
        sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div 
          className="flex-1 text-left"
          dangerouslySetInnerHTML={{
            __html: sender === "bot" ? formatModelResponse(text) : text
          }}
        />
        {sender === "bot" && (
          <button
            onClick={handleCopy}
            className="opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Copy message"
          >
            <Copy size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
