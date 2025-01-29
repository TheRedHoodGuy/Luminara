import { Loader2 } from "lucide-react";

const TypingIndicator = () => {
  return (
    <div className="chat-bubble chat-bubble-bot">
      <Loader2 className="w-5 h-5 animate-spin" />
    </div>
  );
};

export default TypingIndicator;