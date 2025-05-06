
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Send, Maximize2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [expanded, setExpanded] = useState(false);
  
  // Format content extracted based on its type
  const formatContentExtracted = () => {
    if (typeof stats.contentExtracted === 'number') {
      return `${stats.contentExtracted} KB`;
    }
    return stats.contentExtracted;
  };

  const handleSampleQuestionClick = (question: string) => {
    console.log("Question clicked:", question);
    // In Phase 1, this is just for logging - no actual chat functionality
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
                Preview of the chatbot for your website
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setExpanded(!expanded)}
              className="ml-2"
              title={expanded ? "Collapse view" : "Expand view"}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden shadow-sm h-[500px] flex flex-col bg-gray-50">
              {/* Chat header */}
              <div className="bg-dreampath-purple p-3 flex items-center text-white">
                <MessageSquare className="h-5 w-5 mr-2" />
                <div className="font-medium">Website Assistant</div>
              </div>
              
              {/* Chat messages area with fixed height and scrolling */}
              <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col space-y-4">
                  {/* Welcome message */}
                  <div className="bg-gray-200 text-gray-800 self-start rounded-lg p-3 max-w-[80%] text-sm shadow-sm">
                    Hello! I'm your AI assistant for {url}. How can I help you today?
                  </div>

                  {/* If we have questions, show the first one as an example */}
                  {questions.length > 0 && (
                    <>
                      <div className="bg-dreampath-purple text-white self-end rounded-lg p-3 max-w-[80%] text-sm shadow-sm">
                        {questions[0]}
                      </div>
                      
                      <div className="bg-gray-200 text-gray-800 self-start rounded-lg p-3 max-w-[80%] text-sm shadow-sm">
                        Based on the website content, I can provide you with detailed information about this topic. The website covers several key points including services offered, eligibility criteria, and available support options.
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
              
              {/* Sample questions chips */}
              <div className="p-3 border-t bg-white">
                <p className="text-xs text-gray-500 mb-2">Try asking about:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {questions.slice(0, 3).map((question, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 text-xs p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
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
                
                {/* Preview notice */}
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-md p-2 text-xs">
                  <span className="font-medium text-amber-800">This is a preview only.</span>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-dreampath-purple text-dreampath-purple hover:bg-dreampath-purple hover:text-white"
                    disabled
                  >
                    Enable Live Chat
                  </Button>
                </div>
                
                {/* Input field */}
                <div className="mt-3 flex">
                  <input
                    type="text"
                    placeholder="Type your question... (Preview only)"
                    className="flex-1 border rounded-l-md p-2 text-sm bg-gray-100"
                    disabled
                  />
                  <button
                    className="bg-gray-300 text-gray-600 px-4 py-2 rounded-r-md text-sm flex items-center"
                    disabled
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
                  <ScrollArea className="h-[180px]">
                    <ul className="space-y-2">
                      {questions && questions.length > 0 ? (
                        questions.map((question, index) => (
                          <li
                            key={index}
                            className="bg-gray-50 p-2 rounded text-sm flex items-start cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleSampleQuestionClick(question)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                            <span>{question}</span>
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
