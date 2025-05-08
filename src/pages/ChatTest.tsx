
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";
import { createChatSession, getCurrentSession, askQuestion, ChatSession } from "@/services/chatbotService";
import { Loader2 } from "lucide-react";

export default function ChatTest() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [session, setSession] = useState<ChatSession | null>(null);
  const { toast: uiToast } = useToast();

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
        
        // Check connection to n8n
        setConnectionStatus("checking");
        try {
          // Simple fetch to check if n8n is accessible (just a HEAD request)
          const response = await fetch("https://n8n-fpyfr-u38498.vm.elestio.app/", {
            method: "HEAD",
            mode: "no-cors" // This is okay for just checking connectivity
          });
          setConnectionStatus("connected");
          setErrorDetails(null);
        } catch (error) {
          console.error("N8N connection error:", error);
          setConnectionStatus("error");
          setErrorDetails(error.message);
        }
      } catch (error) {
        console.error("Error initializing session:", error);
        uiToast({
          title: "Error",
          description: "Failed to initialize chat session",
          variant: "destructive",
        });
      }
    };
    
    initSession();
  }, [uiToast]);

  const handleSendMessage = async () => {
    if (!message.trim() || !session) return;
    setIsLoading(true);
    
    try {
      // Show sending notification
      toast.loading("Sending message...");
      
      const result = await askQuestion(message, session);
      console.log("Chat response:", result);
      
      // Update the session state with the new session from localStorage
      const updatedSession = getCurrentSession();
      if (updatedSession) {
        setSession(updatedSession);
      }
      
      setMessage("");
      
      // Show success or error toast
      if (result.error) {
        toast.error("Error: " + result.error);
      } else {
        toast.success("Response received");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>N8N Chat Test</span>
            <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
              connectionStatus === "connected" ? "bg-green-100 text-green-800" : 
              connectionStatus === "error" ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {connectionStatus === "connected" ? "Connected" : 
               connectionStatus === "error" ? "Connection Error" : 
               "Checking Connection..."}
            </span>
          </CardTitle>
          <CardDescription>
            Test your n8n chat workflow connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus === "error" && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm">
              <p className="font-semibold">Connection Error</p>
              <p className="mt-1">{errorDetails}</p>
              <p className="mt-2">Make sure your n8n instance is running and accessible from the internet.</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md h-64 overflow-y-auto border">
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
                disabled={isLoading || connectionStatus === "error"}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !message.trim() || connectionStatus === "error"}
                className="min-w-[80px]"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
              </Button>
            </div>
            
            <div className="text-sm text-gray-500 mt-4 p-3 bg-gray-50 rounded-md">
              {session ? (
                <div>
                  <p><span className="font-medium">Session ID:</span> {session.sessionId}</p>
                  <p><span className="font-medium">Questions asked:</span> {session.questionsAsked}/5</p>
                  <p><span className="font-medium">Status:</span> {session.status}</p>
                  <p><span className="font-medium">Website URL:</span> {session.websiteUrl}</p>
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
