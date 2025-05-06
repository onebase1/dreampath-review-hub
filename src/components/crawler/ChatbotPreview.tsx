
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { CrawlResponse } from "./CrawlerForm";

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
          <CardContent className="h-[420px] border rounded-md bg-gray-50 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-xl overflow-hidden border">
                <div className="bg-dreampath-purple p-4 text-white">
                  <div className="font-semibold">Website Assistant</div>
                </div>
                <div className="p-4 h-64 bg-gray-50 overflow-y-auto">
                  <div className="flex flex-col space-y-3">
                    <div className="bg-gray-200 rounded-lg p-3 max-w-[80%] self-start text-sm">
                      Hello! I'm your AI assistant for {url}. How can I help you today?
                    </div>
                    {stats.sampleQuestions.length > 0 && (
                      <div className="bg-dreampath-purple text-white rounded-lg p-3 max-w-[80%] self-end text-sm">
                        {stats.sampleQuestions[0]}
                      </div>
                    )}
                    {stats.sampleQuestions.length > 0 && (
                      <div className="bg-gray-200 rounded-lg p-3 max-w-[80%] self-start text-sm">
                        Based on the website content, I can provide you with detailed information about our services. We offer...
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-3 border-t">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Type your question..."
                      className="flex-1 border rounded-l-md p-2 text-sm"
                      disabled
                    />
                    <button className="bg-dreampath-purple text-white px-4 py-2 rounded-r-md text-sm">
                      Send
                    </button>
                  </div>
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
                  <span className="font-medium">{typeof stats.contentExtracted === 'string' ? stats.contentExtracted : `${stats.contentExtracted} KB`}</span>
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
                {stats.sampleQuestions.map((question, index) => (
                  <li key={index} className="bg-gray-50 p-2 rounded text-sm flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
