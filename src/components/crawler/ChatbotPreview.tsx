
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LeadCaptureForm } from "./LeadCaptureForm";
import {
  ChatMessage,
  ChatSession,
  createChatSession,
  getCurrentSession,
  askQuestion
} from "@/services/chatbotService";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { WebsiteData } from "./WebsiteData";

interface ChatbotPreviewProps {
  stats: {
    pagesCrawled: number;
    contentExtracted: string | number;
    vectorsCreated: number;
    sampleQuestions: string[];
  };
  url: string;
}

export const ChatbotPreview = ({ stats, url }: ChatbotPreviewProps) => {
  // State for UI
  const [expanded, setExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const [isChatActivated, setIsChatActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [questionsRemaining, setQuestionsRemaining] = useState(5);
  
  // State for chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  
  const { toast } = useToast();
  
  // Initialize chat session
  useEffect(() => {
    const initSession = async () => {
      try {
        // Check for existing session first
        const existingSession = getCurrentSession();
        
        if (existingSession && existingSession.websiteUrl === url) {
          console.log("Using existing session:", existingSession);
          setSession(existingSession);
          setMessages(existingSession.messages);
          setQuestionsRemaining(5 - existingSession.questionsAsked);
          
          // Check if user is over quota
          if (existingSession.questionsAsked >= 5 && existingSession.status === 'trial') {
            setShowLeadForm(true);
          }
        } else {
          // Create new session
          console.log("Creating new session for:", url);
          const newSession = await createChatSession(url);
          setSession(newSession);
          setMessages(newSession.messages);
        }
        
        setIsSessionInitialized(true);
      } catch (error) {
        console.error("Error initializing chat session:", error);
        toast({
          title: "Session Error",
          description: "Could not initialize chat session. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    if (url) {
      initSession();
    }
  }, [url, toast]);

  const activateChat = () => {
    if (isSessionInitialized) {
      setIsChatActivated(true);
    } else {
      toast({
        title: "Please wait",
        description: "Chat session is still initializing",
      });
    }
  };

  const handleSampleQuestionClick = (question: string) => {
    if (!isChatActivated) {
      activateChat();
      setTimeout(() => {
        handleSendMessage(question);
      }, 500);
      return;
    }
    
    setInputValue(question);
    handleSendMessage(question);
  };

  const handleSendMessage = async (content?: string) => {
    const messageToSend = content || inputValue;
    
    if (!messageToSend.trim() || !session) return;
    if (isLoading) return;
    
    // Check if we need to show lead form
    if (session.questionsAsked >= 5 && session.status === 'trial') {
      setShowLeadForm(true);
      return;
    }
    
    setIsLoading(true);
    setInputValue("");
    
    try {
      const result = await askQuestion(messageToSend, session);
      
      // Update UI with new messages from service
      const updatedSession = getCurrentSession();
      if (updatedSession) {
        setSession(updatedSession);
        setMessages(updatedSession.messages);
        setQuestionsRemaining(Math.max(0, 5 - updatedSession.questionsAsked));
        
        if (result.error === "Free question limit reached") {
          setShowLeadForm(true);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLeadCaptureSuccess = () => {
    setShowLeadForm(false);
    toast({
      title: "Thank you!",
      description: "You can now continue asking questions about this website."
    });
    
    // Refresh the session
    const updatedSession = getCurrentSession();
    if (updatedSession) {
      setSession(updatedSession);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className={`${expanded ? 'md:col-span-3' : 'md:col-span-2'}`}>
        <Card className="h-full shadow-md border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Chatbot Preview</CardTitle>
              <CardDescription>
                {isChatActivated 
                  ? `${questionsRemaining}/5 free questions remaining` 
                  : "Preview of the chatbot for your website"}
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setExpanded(!expanded)}
              className="ml-2"
              title={expanded ? "Show stats" : "Expand view"}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {showLeadForm ? (
              <div className="border rounded-md overflow-hidden shadow-sm h-[500px] flex items-center justify-center bg-gray-50 p-4">
                <LeadCaptureForm 
                  sessionId={session?.sessionId || ""} 
                  onSuccess={handleLeadCaptureSuccess} 
                />
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden shadow-sm h-[500px] flex flex-col bg-white">
                <ChatHeader
                  isChatActivated={isChatActivated}
                  questionsRemaining={questionsRemaining}
                />
                
                <ChatMessages messages={messages} />
                
                <ChatInput
                  isChatActivated={isChatActivated}
                  isLoading={isLoading}
                  sampleQuestions={Array.isArray(stats.sampleQuestions) ? stats.sampleQuestions : []}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSendMessage={() => handleSendMessage()}
                  onSampleQuestionClick={handleSampleQuestionClick}
                  onActivateChat={activateChat}
                  handleKeyPress={handleKeyPress}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!expanded && (
        <div className="md:col-span-1">
          <WebsiteData 
            stats={stats} 
            onSampleQuestionClick={handleSampleQuestionClick} 
          />
        </div>
      )}
    </div>
  );
};
