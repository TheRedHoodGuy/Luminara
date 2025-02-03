import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface BusinessFields {
  product: string;
  targetCustomer: string;
  geographicMarket: string;
  pricingStrategy: string;
  mainChannels: string;
}

// Fallback responses for when API is not available
const fallbackResponses = [
  "Based on your business details, I recommend focusing on {targetCustomer}. This demographic shows strong potential for {product}.",
  "Looking at the {geographicMarket} market, your {pricingStrategy} pricing strategy seems well-positioned. Consider adjusting based on local competition.",
  "Your choice of {mainChannels} for reaching customers is solid. Have you considered expanding to complementary channels?",
  "I can help analyze your market position and suggest growth strategies. What specific aspect would you like to explore?",
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [businessFields, setBusinessFields] = useState<BusinessFields>({
    product: "",
    targetCustomer: "",
    geographicMarket: "",
    pricingStrategy: "",
    mainChannels: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Set initial welcome message
    const initialMessage: Message = {
      id: "initial",
      text: "Hello! I'm your AI business assistant. How can I help you today? You can ask me about market research, business planning, or get insights from your documents.",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);

    // Load business fields from storage
    const storedFields = localStorage.getItem("businessFields") || sessionStorage.getItem("businessFields");
    if (storedFields) {
      const fields = JSON.parse(storedFields);
      setBusinessFields(fields);
      setFormSubmitted(true);
    }

    // Check API availability
    fetch("https://bizi-rgdl.onrender.com/health")
      .catch(() => {
        setUseLocalFallback(true);
        toast({
          description: "Using offline mode due to connection issues",
        });
      });
  }, [toast]);

  const getFallbackResponse = (input: string, fields: BusinessFields): string => {
    const response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return response.replace(/\{(\w+)\}/g, (_, key) => fields[key as keyof BusinessFields] || key);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let botResponse: string;

      if (!useLocalFallback) {
        try {
          const response = await fetch("https://bizi-rgdl.onrender.com/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: input,
              history: messages.slice(1).map((msg) => ({
                role: msg.sender === "user" ? "user" : "model",
                text: msg.text,
              })),
              ...businessFields,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          botResponse = data.response;
        } catch (error) {
          console.warn("API error, falling back to local responses:", error);
          setUseLocalFallback(true);
          botResponse = getFallbackResponse(input, businessFields);
        }
      } else {
        botResponse = getFallbackResponse(input, businessFields);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error handling message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        description: "Failed to process message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitBusinessForm = () => {
    const storageData = JSON.stringify(businessFields);
    localStorage.setItem("businessFields", storageData);
    sessionStorage.setItem("businessFields", storageData);
    setFormSubmitted(true);
    toast({
      description: "Business information saved successfully!",
    });
  };

  const quickActions = [
    "Analyze my market",
    "Review business plan",
    "Financial insights",
    "Competitor analysis",
    "Growth strategies",
    "Risk assessment",
  ];

  return (
    <div id="chat-interface" className="max-w-4xl mx-auto p-4">
      <div className="glass rounded-2xl min-h-[600px] flex flex-col">
        {!formSubmitted ? (
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Tell us about your business</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  What product or service do you offer?
                </label>
                <Input
                  value={businessFields.product}
                  onChange={(e) =>
                    setBusinessFields((prev) => ({ ...prev, product: e.target.value }))
                  }
                  placeholder="Be specific – the more detail, the better"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Who is your target customer?
                </label>
                <Input
                  value={businessFields.targetCustomer}
                  onChange={(e) =>
                    setBusinessFields((prev) => ({ ...prev, targetCustomer: e.target.value }))
                  }
                  placeholder="Demographics, psychographics, buying behavior"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  What is your geographic market?
                </label>
                <Input
                  value={businessFields.geographicMarket}
                  onChange={(e) =>
                    setBusinessFields((prev) => ({ ...prev, geographicMarket: e.target.value }))
                  }
                  placeholder="Local, regional, national, or international"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  What is your pricing strategy?
                </label>
                <Input
                  value={businessFields.pricingStrategy}
                  onChange={(e) =>
                    setBusinessFields((prev) => ({ ...prev, pricingStrategy: e.target.value }))
                  }
                  placeholder="How does it compare to competitors?"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  What are your main customer channels?
                </label>
                <Input
                  value={businessFields.mainChannels}
                  onChange={(e) =>
                    setBusinessFields((prev) => ({ ...prev, mainChannels: e.target.value }))
                  }
                  placeholder="Online advertising, social media, direct sales, etc."
                />
              </div>
              <Button
                onClick={handleSubmitBusinessForm}
                className="md:col-span-2"
                size="lg"
              >
                Submit
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  text={message.text}
                  sender={message.sender}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              isLoading={isLoading}
            />
            <div className="p-4 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    className="text-sm"
                    onClick={() => {
                      setInput(action);
                      handleSend();
                    }}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
