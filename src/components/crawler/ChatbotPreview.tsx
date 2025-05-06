import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Send, Loader } from "lucide-react";
import { CrawlResponse } from "./CrawlerForm";
import { useToast } from "@/hooks/use-toast";

interface ChatbotPreviewProps {
  stats: {
    pagesCrawled: number;
    contentExtracted: string | number;
    vectorsCreated: number;
    sampleQuestions: string[];
  };
  url: string;
}

interface Message {
  content: string;
  isUser: boolean;
}

export const ChatbotPreview = ({ stats, url }: ChatbotPreviewProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      content: url
        ? `Hello! I'm your AI assistant for ${url}. How can I help you today?`
        : `Hello! I'm your AI assistant. How can I help you today?`,
      isUser: false
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Format content extracted based on its type
  const formatContentExtracted = () => {
    if (typeof stats.contentExtracted === 'number') {
      return `${stats.contentExtracted} KB`;
    }
    return stats.contentExtracted;
  };

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      content: input,
      isUser: true
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Ensure we have a valid URL
    const chatUrl = url || "https://example.com";
    console.log("Sending message with URL:", chatUrl);

    try {
      // Send message to the webhook
      const response = await fetch("http://localhost:5678/webhook/59044fe5-81db-44aa-989b-7a677ddcf551", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          // Use the original URL from the stats object, not the potentially modified URL from the response
          originalUrl: chatUrl,
          url: chatUrl // Include both for backward compatibility
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response
      const aiMessage: Message = {
        content: data.content || "I'm sorry, I couldn't process your request.",
        isUser: false
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          content: "Sorry, I encountered an error. Please try again.",
          isUser: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sample question click
  const handleSampleQuestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Chatbot Preview</CardTitle>
            <CardDescription>
              Try asking questions about the crawled website
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[420px] border rounded-md bg-gray-50 flex flex-col">
            <div className="w-full h-full flex flex-col">
              <div className="bg-dreampath-purple p-4 text-white">
                <div className="font-semibold">Website Assistant</div>
              </div>
              <div className="p-4 flex-1 bg-gray-50 overflow-y-auto">
                <div className="flex flex-col space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`${
                        message.isUser
                          ? "bg-dreampath-purple text-white self-end"
                          : "bg-gray-200 text-gray-800 self-start"
                      } rounded-lg p-3 max-w-[80%] text-sm`}
                    >
                      {message.content}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="bg-gray-200 rounded-lg p-3 max-w-[80%] self-start text-sm flex items-center">
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Thinking...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="p-3 border-t">
                <form onSubmit={handleSubmit} className="flex">
                  <input
                    type="text"
                    placeholder="Type your question..."
                    className="flex-1 border rounded-l-md p-2 text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="bg-dreampath-purple text-white px-4 py-2 rounded-r-md text-sm flex items-center"
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>
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
                {stats.sampleQuestions && stats.sampleQuestions.length > 0 ? (
                  stats.sampleQuestions.map((question, index) => (
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
