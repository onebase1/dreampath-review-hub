
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Send, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // For Phase 1, we'll show a read-only interface
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Chatbot Preview</CardTitle>
            <CardDescription>
              Preview of the chatbot for your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[420px] border rounded-md bg-gray-50 flex flex-col">
              <div className="bg-dreampath-purple p-4 text-white">
                <div className="font-semibold">Website Assistant</div>
              </div>
              
              <div className="p-4 flex-1 bg-gray-50 overflow-y-auto">
                <div className="flex flex-col space-y-3">
                  {/* Welcome message */}
                  <div className="bg-gray-200 text-gray-800 self-start rounded-lg p-3 max-w-[80%] text-sm">
                    Hello! I'm your AI assistant for {url}. How can I help you today?
                  </div>

                  {/* If we have questions, show the first one as an example */}
                  {questions.length > 0 && (
                    <>
                      <div className="bg-dreampath-purple text-white self-end rounded-lg p-3 max-w-[80%] text-sm">
                        {questions[0]}
                      </div>
                      
                      <div className="bg-gray-200 text-gray-800 self-start rounded-lg p-3 max-w-[80%] text-sm">
                        Based on the website content, I can provide you with detailed information about this topic. The website covers several key points...
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Sample questions section */}
              <div className="p-3 border-t">
                <p className="text-sm text-gray-500 mb-2">Try asking about:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {questions.map((question, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 text-sm p-2 rounded cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSampleQuestionClick(question)}
                    >
                      {question}
                    </div>
                  ))}
                </div>
                
                {/* Phase 2 notice */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm">
                  <p className="font-medium flex items-center justify-between">
                    <span>This is a preview only.</span>
                    <Button 
                      variant="outline"
                      className="border-dreampath-purple text-dreampath-purple hover:bg-dreampath-purple hover:text-white"
                      disabled
                    >
                      Enable Live Chat
                    </Button>
                  </p>
                </div>
                
                {/* Disabled input for visual consistency */}
                <div className="mt-4 flex">
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

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Website Data</CardTitle>
            <CardDescription>
              Information extracted from your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Pages Crawled</span>
                  <span className="font-medium">{stats.pagesCrawled}</span>
                </div>
                <Progress value={100} className="h-1" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Content Extracted</span>
                  <span className="font-medium">{formatContentExtracted()}</span>
                </div>
                <Progress value={100} className="h-1" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Vectors Created</span>
                  <span className="font-medium">{stats.vectorsCreated}</span>
                </div>
                <Progress value={100} className="h-1" />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-sm text-gray-700 mb-2">Sample Questions</h3>
              <ul className="space-y-2">
                {questions && questions.length > 0 ? (
                  questions.map((question, index) => (
                    <li
                      key={index}
                      className="bg-gray-50 p-2 rounded text-sm flex items-start cursor-pointer hover:bg-gray-100"
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
