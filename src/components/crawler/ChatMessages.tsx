
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/services/chatbotService";

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 bg-gray-50">
      <div className="flex flex-col space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={index}
            className={`${msg.isUser 
              ? 'bg-dreampath-purple text-white self-end' 
              : 'bg-white border border-gray-100 text-gray-800 self-start'} 
              rounded-lg p-3 max-w-[80%] text-sm shadow-sm`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
