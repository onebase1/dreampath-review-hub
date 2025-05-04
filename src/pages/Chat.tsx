
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChatMessage from "@/components/ChatMessage";

type MessageType = "text" | "image" | "video";

interface Message {
  id: string;
  content: string;
  type: MessageType;
  isUser: boolean;
}

const Chat = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [webhookUrl, setWebhookUrl] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    if (!webhookUrl) {
      toast({
        title: "Missing Webhook URL",
        description: "Please enter the n8n webhook URL to send messages",
        variant: "destructive",
      });
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: "text",
      isUser: true,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: input,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Process response based on content type
      let responseType: MessageType = "text";
      let content = "";
      
      // Determine content type based on response structure
      if (typeof data === "string") {
        content = data;
      } else if (data.text) {
        content = data.text;
      } else if (data.message) {
        content = data.message;
      } else if (data.image || data.imageUrl) {
        responseType = "image";
        content = data.image || data.imageUrl;
      } else if (data.video || data.videoUrl) {
        responseType = "video";
        content = data.video || data.videoUrl;
      } else {
        content = JSON.stringify(data);
      }

      // Add AI response message
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: content,
        type: responseType,
        isUser: false,
      };
      
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please check your webhook URL and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-dreampath-dark-purple">AI Marketing Assistant</h1>
        </div>
      </header>

      <div className="container mx-auto p-4 flex-1 flex flex-col max-w-4xl">
        <div className="mb-4">
          <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 mb-1">
            n8n Webhook URL
          </label>
          <Input
            id="webhook-url"
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="Enter your n8n webhook URL"
            className="w-full"
          />
        </div>

        {/* Message history */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="mb-2 text-center">Welcome to your AI Marketing Assistant</p>
              <p className="text-sm text-center">
                You can ask me to create or edit images, write blog posts or LinkedIn content, create videos, and more!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your marketing assistant..."
            className="flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send size={18} className="mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
