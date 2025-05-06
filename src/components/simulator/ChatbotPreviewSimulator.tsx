
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Send, Maximize2, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotPreviewSimulatorProps {
  stats: {
    pagesCrawled: number;
    contentExtracted: string | number;
    vectorsCreated: number;
    sampleQuestions: string[];
  };
  url: string;
}

export const ChatbotPreviewSimulator = ({ stats, url }: ChatbotPreviewSimulatorProps) => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      content: `Hello! I'm your AI assistant for ${url}. How can I help you today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  
  // Format content extracted based on its type
  const formatContentExtracted = () => {
    if (typeof stats.contentExtracted === 'number') {
      return `${stats.contentExtracted} KB`;
    }
    return stats.contentExtracted;
  };

  const handleSampleQuestionClick = (question: string) => {
    // Add the question to messages
    addMessage(question, true);
    
    // Generate a response after a short delay
    setTimeout(() => {
      const responses = [
        `Based on the content from ${url}, I can tell you that our services include web development, app design, and digital marketing solutions tailored for businesses of all sizes.`,
        `According to the website information, you can contact customer support via email at support@${url.replace('https://', '')} or call our helpline at (555) 123-4567 during business hours.`,
        `The website offers three pricing tiers: Basic ($29/month), Professional ($79/month), and Enterprise (custom pricing). Each plan includes different features based on business needs.`,
        `Based on the information I've extracted, I can provide you with detailed information about this topic. The website covers several key aspects including available options, requirements, and next steps.`
      ];
      
      // Select a random response or the last one as fallback
      const responseIndex = Math.min(Math.floor(Math.random() * responses.length), responses.length - 1);
      addMessage(responses[responseIndex], false);
    }, 1000);
  };

  const addMessage = (content: string, isUser: boolean) => {
    setMessages(prev => [...prev, {
      content,
      isUser,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      handleSampleQuestionClick(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
                Interactive preview of the chatbot for your website
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
            <div className="border rounded-md overflow-hidden shadow-sm h-[500px] flex flex-col bg-white">
              {/* Chat header */}
              <div className="bg-dreampath-purple p-3 flex items-center justify-between text-white">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <div className="font-medium">Website Assistant</div>
                </div>
                <Badge variant="secondary" className="text-xs bg-white/20 hover:bg-white/30">
                  Powered by AI
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
                
                {/* Input field */}
                <div className="mt-3 flex items-center">
                  <input
                    type="text"
                    placeholder="Type your message here..."
                    className="flex-1 border rounded-l-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-dreampath-purple"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="bg-dreampath-purple text-white px-4 py-2 rounded-r-md text-sm flex items-center"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
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
                  <ScrollArea className="h-[180px] border rounded-md p-2">
                    <ul className="space-y-2">
                      {questions.map((question, index) => (
                        <li
                          key={index}
                          className="bg-gray-50 p-2 rounded text-sm flex items-start cursor-pointer hover:bg-gray-100 transition-colors group"
                          onClick={() => handleSampleQuestionClick(question)}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                          <span>{question}</span>
                          <ArrowRight className="h-3 w-3 ml-1 mt-0.5 opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity" />
                        </li>
                      ))}
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
