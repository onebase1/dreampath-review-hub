
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Code, BarChart2, Settings, MessageSquare, AlertTriangle, Send } from "lucide-react";
import { EmbedCode } from "@/components/crawler/EmbedCode";
import { AnalyticsTab } from "@/components/crawler/AnalyticsTab";
import { CustomizeTab } from "@/components/crawler/CustomizeTab";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

// Mock data for simulation
const mockChatbotData = {
  exampleQuestions: [
    "Tell me about the history of the Taj Mahal",
    "Calculate the derivative of the function y = 3x^2 +2x - 1",
    "What news happened in the world today?"
  ],
  capabilities: [
    "Supports user-provided follow-up corrections",
    "Programmed to reject inappropriate solicitations",
    "Retains previous user inputs during the ongoing conversation"
  ],
  limitations: [
    "May sometimes produce inaccurate or erroneous data",
    "Might create harmful or biased content at times",
    "Limited awareness of post-2021 world events"
  ]
};

const ChatbotSimulator = () => {
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex flex-col h-screen">
      {/* Dark Header */}
      <div className="bg-[#1A1F2C] text-white p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">CogniChat</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Explore Deeper Insights, Engage in Meaningful Discussions,
          and Unlock New Possibilities with CogniChat
        </p>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/crawler">
            <Button variant="outline">Back to Crawler</Button>
          </Link>
          
          <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-64">
            <TabsList className="grid grid-cols-4 shadow-sm">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Preview</span>
              </TabsTrigger>
              <TabsTrigger value="embed" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span className="sr-only">Embed</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span className="sr-only">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="customize" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Customize</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <TabsContent value="preview" className="mt-0 animate-fade-in">
          {/* Cards Grid for Examples, Capabilities and Limitations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-[#1e2230] text-white border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-blue-800 p-2 rounded">
                    <MessageSquare className="h-5 w-5 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-medium">Example</h3>
                </div>
                <div className="space-y-3">
                  {mockChatbotData.exampleQuestions.map((question, index) => (
                    <p key={index} className="text-sm text-gray-300">
                      "{question}"
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1e2230] text-white border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-blue-800 p-2 rounded">
                    <Send className="h-5 w-5 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-medium">Capabilities</h3>
                </div>
                <div className="space-y-3">
                  {mockChatbotData.capabilities.map((capability, index) => (
                    <p key={index} className="text-sm text-gray-300">
                      {capability}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1e2230] text-white border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-blue-800 p-2 rounded">
                    <AlertTriangle className="h-5 w-5 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-medium">Limitations</h3>
                </div>
                <div className="space-y-3">
                  {mockChatbotData.limitations.map((limitation, index) => (
                    <p key={index} className="text-sm text-gray-300">
                      {limitation}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Input */}
          <div className="bg-[#1e2230] rounded-lg p-4 mt-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Send a message"
                className="bg-[#2a3042] border-none text-white"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button size="icon" className="bg-blue-800 hover:bg-blue-700">
                <Send className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="text-white border-gray-600">
                <svg 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" 
                    fill="currentColor" 
                  />
                </svg>
              </Button>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">
              Free Research Preview. CogniChat may produce inaccurate information about people, places, or facts. CogniChat July 20 Version
            </div>
          </div>
        </TabsContent>

        <TabsContent value="embed">
          <EmbedCode url="example.com" />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="customize">
          <CustomizeTab />
        </TabsContent>
      </div>
    </div>
  );
};

export default ChatbotSimulator;
