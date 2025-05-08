
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createChatSession, getCurrentSession, askQuestion, ChatSession } from "@/services/chatbotService";

export default function ChatTest() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const { toast } = useToast();

  // Initialize session on component mount
  useEffect(() => {
    const initSession = async () => {
      try {
        // Check for existing session
        let currentSession = getCurrentSession();
        
        if (!currentSession) {
          // Create a new session with a test website URL
          currentSession = await createChatSession("https://example.com");
          console.log("Created new session:", currentSession);
        }
        
        setSession(currentSession);
      } catch (error) {
        console.error("Error initializing session:", error);
        toast({
          title: "Error",
          description: "Failed to initialize chat session",
          variant: "destructive",
        });
      }
    };
    
    initSession();
  }, [toast]);

  const handleSendMessage = async () => {
    if (!message.trim() || !session) return;
    setIsLoading(true);
    
    try {
      const result = await askQuestion(message, session);
      console.log("Chat response:", result);
      
      // Update the session state with the new session from localStorage
      const updatedSession = getCurrentSession();
      if (updatedSession) {
        setSession(updatedSession);
      }
      
      setMessage("");
      
      toast({
        title: "Message sent",
        description: "Response received successfully",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>N8N Chat Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-md h-64 overflow-y-auto">
              {session?.messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`mb-2 p-3 rounded-lg ${
                    msg.isUser 
                      ? "bg-blue-500 text-white self-end ml-auto" 
                      : "bg-gray-200 text-gray-800"
                  } max-w-[80%] ${msg.isUser ? "ml-auto" : ""}`}
                  style={{ display: "inline-block", clear: "both", float: msg.isUser ? "right" : "left", width: "auto" }}
                >
                  {msg.content}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !message.trim()}>
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              {session ? (
                <div>
                  <p>Session ID: {session.sessionId}</p>
                  <p>Questions asked: {session.questionsAsked}/5</p>
                  <p>Status: {session.status}</p>
                </div>
              ) : (
                "Initializing session..."
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
