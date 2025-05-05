
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, History, Trash, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChatMessage from "@/components/ChatMessage";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type MessageType = "text" | "image" | "video";

interface Message {
  id: string;
  content: string;
  type: MessageType;
  isUser: boolean;
  timestamp: string;
}

// Default webhook URL - can be changed by the user if needed
const DEFAULT_WEBHOOK_URL = "https://n8n-fpyfr-u38498.vm.elestio.app/webhook-test/8cca690c-79d6-4576-b212-8bf0572ac384";

// Keys for local storage
const CHAT_HISTORY_KEY = "dreampath-chat-history";
const USER_ID_KEY = "dreampath-user-id";

const Chat = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [webhookUrl, setWebhookUrl] = useState(DEFAULT_WEBHOOK_URL);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Generate or retrieve a consistent userId
  const generateUserId = () => {
    let storedUserId = localStorage.getItem(USER_ID_KEY);
    
    if (!storedUserId) {
      storedUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(USER_ID_KEY, storedUserId);
    }
    
    return storedUserId;
  };

  // Initialize userId on component mount
  useEffect(() => {
    const generatedUserId = generateUserId();
    setUserId(generatedUserId);
    console.log("User ID:", generatedUserId);
  }, []);

  // Load messages from local storage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (err) {
        console.error("Failed to load chat history:", err);
        // If we can't parse the history, we'll reset it
        localStorage.removeItem(CHAT_HISTORY_KEY);
      }
    }
  }, []);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save messages to local storage when they change
  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  // Set the selected image URL from a chat message
  const handleImageSelection = (url: string) => {
    setSelectedImageUrl(url);
    // Update input with a prefilled message for editing
    setInput(`Edit this image: add `);
    toast({
      title: "Image selected",
      description: "Now describe how you want to edit this image",
    });
  };

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
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Prepare the request payload
      const payload: Record<string, any> = { 
        message: input,
        timestamp: new Date().toISOString(),
        userId: userId, // Include userId with each request
      };

      // If we have a selected image URL, include it in the payload
      if (selectedImageUrl) {
        payload.photoId = selectedImageUrl;
        console.log("Sending image edit request with photoId:", selectedImageUrl);
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Extract the actual content from the response
      let content = "";
      let responseType: MessageType = "text";
      
      if (data.output) {
        content = data.output;
      } else if (typeof data === "string") {
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
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, aiMessage]);

      // Reset the selected image URL after sending the request
      setSelectedImageUrl("");

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

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setHistoryOpen(false);
    toast({
      title: "History cleared",
      description: "Your chat history has been cleared successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-dreampath-dark-purple">AI Marketing Assistant</h1>
        </div>
        <div className="flex items-center space-x-2">
          {selectedImageUrl && (
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm">
              <ImageIcon size={16} className="mr-2" />
              Image selected for editing
            </div>
          )}
          <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <History size={18} className="mr-2" />
                History
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Chat History</DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <ScrollArea className="h-[50vh]">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No chat history yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(message => (
                        <div key={message.id} className="border-b pb-2 last:border-0">
                          <div className="flex items-start justify-between">
                            <p className="font-medium">{message.isUser ? "You" : "AI Assistant"}</p>
                            <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
                          </div>
                          <p className="text-sm mt-1 truncate">{message.content.substring(0, 100)}{message.content.length > 100 ? "..." : ""}</p>
                          {message.type !== "text" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                              {message.type}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
              <DialogFooter>
                <Button onClick={clearHistory} variant="destructive" size="sm" disabled={messages.length === 0}>
                  <Trash size={16} className="mr-2" />
                  Clear History
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto p-4 flex-1 flex flex-col max-w-4xl">
        {/* Hidden webhook URL input - can be revealed if needed */}
        <div className="hidden">
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

        {/* User ID display - also hidden by default */}
        <div className="hidden">
          <p className="text-sm text-gray-500">User ID: {userId}</p>
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
              <ChatMessage 
                key={message.id} 
                message={message} 
                onSelectImage={message.type === "image" && !message.isUser ? handleImageSelection : undefined}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedImageUrl ? "Describe how to edit the image..." : "Ask your marketing assistant..."}
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
