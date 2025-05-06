
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Send, Maximize2, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { LeadCaptureForm } from "./LeadCaptureForm";
import {
  ChatMessage,
  ChatSession,
  createChatSession,
  getCurrentSession,
  askQuestion
} from "@/services/chatbotService";

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
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Format content extracted based on its type
  const formatContentExtracted = () => {
    if (typeof stats.contentExtracted === 'number') {
      return `${stats.contentExtracted} KB`;
    }
    return stats.contentExtracted;
  };

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

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  // Ensure sampleQuestions is an array for safe rendering
  const questions = Array.isArray(stats.sampleQuestions) ? stats.sampleQuestions : [];

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
                {/* Chat header */}
                <div className="bg-dreampath-purple p-3 flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    <div className="font-medium">Website Assistant</div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-white/20 hover:bg-white/30">
                    {isChatActivated 
                      ? `${questionsRemaining}/5 Questions` 
                      : "Preview Mode"}
                  </Badge>
                </div>
                
                {/* Chat messages area with fixed height and scrolling */}
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
                
                <Separator />
                
                {/* Sample questions chips */}
                <div className="p-3 bg-white">
                  <p className="text-xs text-gray-500 mb-2">Try asking about:</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {questions.slice(0, 3).map((question, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 hover:bg-gray-200 text-xs p-2 rounded-full cursor-pointer transition-colors"
                        onClick={() => handleSampleQuestionClick(question)}
                      >
                        {question.length > 30 ? question.substring(0, 30) + '...' : question}
                      </div>
                    ))}
                    {questions.length > 3 && (
                      <div className="bg-gray-100 text-xs p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                        +{questions.length - 3} more
                      </div>
                    )}
                  </div>
                  
                  {/* Input field or activation button */}
                  {isChatActivated ? (
                    <div className="mt-3 flex items-center">
                      <input
                        type="text"
                        placeholder="Type your message here..."
                        className="flex-1 border rounded-l-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-dreampath-purple"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                      />
                      <button
                        className={`${
                          isLoading 
                            ? 'bg-gray-400' 
                            : 'bg-dreampath-purple hover:bg-dreampath-dark-purple'
                        } text-white px-4 py-2 rounded-r-md text-sm flex items-center transition-colors`}
                        onClick={() => handleSendMessage()}
                        disabled={isLoading}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Button 
                      onClick={activateChat}
                      className="w-full mt-3 bg-dreampath-purple hover:bg-dreampath-dark-purple"
                    >
                      Try it now
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!expanded && (
        <div className="md:col-span-1">
          <Card className="h-full shadow-md border-gray-100">
            <CardHeader>
              <CardTitle>Website Data</CardTitle>
              <CardDescription>
                Information extracted from your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Pages Crawled</span>
                    <span className="font-medium">{stats.pagesCrawled}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Content Extracted</span>
                    <span className="font-medium">{formatContentExtracted()}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Vectors Created</span>
                    <span className="font-medium">{stats.vectorsCreated}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div>
                  <h3 className="font-medium text-sm text-gray-700 mb-2">Sample Questions</h3>
                  <ScrollArea className="h-[180px]">
                    <ul className="space-y-2">
                      {questions && questions.length > 0 ? (
                        questions.map((question, index) => (
                          <li
                            key={index}
                            className="bg-gray-50 p-2 rounded text-sm flex items-start cursor-pointer hover:bg-gray-100 transition-colors group"
                            onClick={() => handleSampleQuestionClick(question)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                            <span>{question}</span>
                            <ArrowRight className="h-3 w-3 ml-1 mt-0.5 opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity" />
                          </li>
                        ))
                      ) : (
                        <li className="bg-gray-50 p-2 rounded text-sm">
                          <span>No sample questions available</span>
                        </li>
                      )}
                    </ul>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
