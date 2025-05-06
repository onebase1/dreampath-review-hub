
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Code, BarChart2, Settings } from "lucide-react";
import { ChatbotPreviewSimulator } from "@/components/simulator/ChatbotPreviewSimulator";
import { EmbedCode } from "@/components/crawler/EmbedCode";
import { AnalyticsTab } from "@/components/crawler/AnalyticsTab";
import { CustomizeTab } from "@/components/crawler/CustomizeTab";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data for simulation
const mockChatbotStats = {
  pagesCrawled: 12,
  contentExtracted: "320 KB",
  vectorsCreated: 180,
  sampleQuestions: [
    "What services does your company offer?",
    "How can I contact customer support?",
    "Do you have any pricing information?",
    "What is your return policy?",
    "Is there a free trial available?",
    "How does your product work?",
    "Can you tell me about your team?",
    "Where are you located?"
  ],
  url: "https://example.com"
};

const ChatbotSimulator = () => {
  const [activeTab, setActiveTab] = useState<string>("preview");

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chatbot Simulator</h1>
        <Link to="/crawler">
          <Button variant="outline">Back to Crawler</Button>
        </Link>
      </div>
      
      <Card className="mb-6 border-amber-200 bg-amber-50 shadow-sm">
        <CardContent className="py-4">
          <p className="text-amber-800">
            This is a simulation environment for testing the chatbot interface. You can interact with the preview 
            to see how users will experience your chatbot without running an actual website crawl.
          </p>
        </CardContent>
      </Card>

      <div className="animate-fade-in">
        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 shadow-sm">
            <TabsTrigger value="preview" className="flex items-center gap-2 py-3">
              <Globe className="h-4 w-4" />
              <span>Preview</span>
            </TabsTrigger>
            <TabsTrigger value="embed" className="flex items-center gap-2 py-3">
              <Code className="h-4 w-4" />
              <span>Embed</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 py-3">
              <BarChart2 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center gap-2 py-3">
              <Settings className="h-4 w-4" />
              <span>Customize</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-0">
            <ChatbotPreviewSimulator stats={mockChatbotStats} url={mockChatbotStats.url} />
          </TabsContent>

          <TabsContent value="embed">
            <EmbedCode url={mockChatbotStats.url} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="customize">
            <CustomizeTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChatbotSimulator;
