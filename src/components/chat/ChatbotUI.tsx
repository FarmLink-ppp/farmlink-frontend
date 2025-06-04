
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatbotUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your FarmLink AI assistant. How can I help you with your farming questions today? 🌱",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const botResponses = [
    "For tomatoes showing yellow leaves, this could indicate nitrogen deficiency. Try using a balanced fertilizer with higher nitrogen content and ensure proper watering schedule.",
    "The best time to plant corn in your region is typically early spring when soil temperatures reach about 55°F (13°C). Check your local frost dates for optimal timing.",
    "For natural pest control, consider companion planting with marigolds, which repel many harmful insects. Neem oil is also an excellent organic option.",
    "Based on your location's forecast, I recommend delaying irrigation until Thursday to avoid over-watering. The predicted rainfall should provide adequate moisture.",
    "Your soil analysis shows good phosphorus levels, but you might want to add potassium for better plant vigor. Consider using wood ash or potassium sulfate.",
    "That's a great question! For disease prevention, ensure proper air circulation between plants and avoid overhead watering which can spread fungal spores."
  ];

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage: Message = {
        id: messages.length + 2,
        content: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <Card className="h-full flex flex-col border-0 bg-white/70 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-3 border-b border-farmlink-lightgreen/20 bg-gradient-to-r from-farmlink-green/5 to-farmlink-mediumgreen/5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen rounded-2xl flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-farmlink-darkgreen flex items-center">
              FarmLink AI Assistant
              <Sparkles className="ml-2 h-4 w-4 text-farmlink-green" />
            </CardTitle>
            <p className="text-sm text-farmlink-darkgreen/70">Powered by agricultural expertise</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-farmlink-offwhite/20 to-white/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div className={`flex items-start space-x-3 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
              <Avatar className="w-8 h-8 border-2 border-white shadow-md">
                {message.sender === "user" ? (
                  <div className="w-full h-full bg-gradient-to-br from-farmlink-lightgreen to-farmlink-mediumgreen flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <AvatarFallback>{message.sender === "user" ? "U" : "AI"}</AvatarFallback>
              </Avatar>
              <div
                className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                  message.sender === "user"
                    ? "bg-gradient-to-br from-farmlink-green to-farmlink-mediumgreen text-white"
                    : "bg-white/90 text-farmlink-darkgreen border border-farmlink-lightgreen/20"
                }`}
              >
                <p className="leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${message.sender === "user" ? "text-farmlink-offwhite/80" : "text-farmlink-darkgreen/60"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t border-farmlink-lightgreen/20 p-6 bg-white/50">
        <div className="flex w-full space-x-3">
          <Input
            placeholder="Ask me anything about farming..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="bg-white/80 border-farmlink-lightgreen/30 focus:border-farmlink-green focus:ring-farmlink-green/20 text-farmlink-darkgreen placeholder:text-farmlink-darkgreen/60"
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen hover:from-farmlink-mediumgreen hover:to-farmlink-darkgreen text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatbotUI;