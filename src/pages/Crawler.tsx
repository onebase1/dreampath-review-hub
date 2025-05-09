
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Code, BarChart2, Settings } from "lucide-react";
import { CrawlerForm, CrawlResponse } from "@/components/crawler/CrawlerForm";
import { ChatbotPreview } from "@/components/crawler/ChatbotPreview";
import { EmbedCode } from "@/components/crawler/EmbedCode";
import { AnalyticsTab } from "@/components/crawler/AnalyticsTab";
import { CustomizeTab } from "@/components/crawler/CustomizeTab";

const Crawler = () => {
  const [isChatbotReady, setIsChatbotReady] = useState(false);
  const [chatbotStats, setChatbotStats] = useState({
    pagesCrawled: 0,
    contentExtracted: "", 
    vectorsCreated: 0,
    sampleQuestions: [] as string[],
    url: ""
  });
  const [activeTab, setActiveTab] = useState<string>("preview");

  const handleCrawlSuccess = (data: CrawlResponse) => {
    // Preserve the original URL from the data or use the one from the response
    const originalUrl = data.originalUrl || data.url || "https://example.com";
    
    // Parse stats based on the format received
    let pagesCrawled = 0;
    let contentExtracted = "0 KB";
    let vectorsCreated = 0;
    
    if (Array.isArray(data.stats)) {
      // Handle array format from the updated API
      pagesCrawled = Number(data.stats[0] || 0);
      contentExtracted = String(data.stats[1] || "0 KB");
      vectorsCreated = Number(data.stats[2] || 0);
    } else if (typeof data.stats === 'string') {
      try {
        const statsObj = JSON.parse(data.stats);
        pagesCrawled = typeof statsObj.pagesCrawled === 'string'
          ? parseInt(statsObj.pagesCrawled) || 0
          : Number(statsObj.pagesCrawled) || 0;
        
        contentExtracted = String(statsObj.contentExtracted || "0 KB");
        
        vectorsCreated = typeof statsObj.vectorsCreated === 'string'
          ? parseInt(statsObj.vectorsCreated) || 0
          : Number(statsObj.vectorsCreated) || 0;
      } catch (e) {
        console.error("Failed to parse stats:", e);
      }
    } else if (typeof data.stats === 'object' && data.stats !== null) {
      // Handle object stats format
      const statsObj = data.stats;
      pagesCrawled = typeof statsObj.pagesCrawled === 'string'
        ? parseInt(statsObj.pagesCrawled) || 0
        : Number(statsObj.pagesCrawled) || 0;
        
      contentExtracted = String(statsObj.contentExtracted || "0 KB");
      
      vectorsCreated = typeof statsObj.vectorsCreated === 'string'
        ? parseInt(statsObj.vectorsCreated) || 0
        : Number(statsObj.vectorsCreated) || 0;
    }

    // Ensure questions are properly processed regardless of format
    let questions: string[] = [];
    
    if (data.questions) {
      if (Array.isArray(data.questions)) {
        questions = data.questions;
      } else if (typeof data.questions === 'string') {
        try {
          // Try to parse the questions if they're a JSON string
          const parsedQuestions = JSON.parse(data.questions);
          questions = Array.isArray(parsedQuestions) ? parsedQuestions : [];
        } catch (e) {
          // If parsing fails, split by commas as a fallback
          // Add explicit type check to satisfy TypeScript
          const questionsStr = data.questions as string;
          questions = questionsStr.split(',').map(q => q.trim()).filter(Boolean);
        }
      }
    } else if (data.sampleQuestions) {
      if (Array.isArray(data.sampleQuestions)) {
        questions = data.sampleQuestions;
      } else if (typeof data.sampleQuestions === 'string') {
        try {
          // Try to parse the sampleQuestions if they're a JSON string
          const parsedQuestions = JSON.parse(data.sampleQuestions);
          questions = Array.isArray(parsedQuestions) ? parsedQuestions : [];
        } catch (e) {
          // If parsing fails, split by commas as a fallback
          // Add explicit type check to satisfy TypeScript
          const sampleQuestionsStr = data.sampleQuestions as string;
          questions = sampleQuestionsStr.split(',').map(q => q.trim()).filter(Boolean);
        }
      }
    }

    // Update the stats display with proper type handling
    setChatbotStats({
      pagesCrawled,
      contentExtracted,
      vectorsCreated,
      sampleQuestions: questions,
      url: originalUrl
    });

    // Show completion and set chatbot ready
    setIsChatbotReady(true);

    // Log the URL for debugging
    console.log("Using URL for chatbot:", originalUrl);
    console.log("Stats:", { pagesCrawled, contentExtracted, vectorsCreated });
    console.log("Sample questions:", questions);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Website Crawler & Chatbot Generator</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create an AI-powered chatbot from any website in <span className="font-semibold text-dreampath-purple">under 2 minutes</span>.
          Just enter the URL and we'll do the rest.
        </p>
      </div>

      <Card className="mb-8 border-2 border-gray-100 shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl">Enter Website URL</CardTitle>
          <CardDescription>
            We'll crawl the website, process the content, and generate a custom chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CrawlerForm onSuccess={handleCrawlSuccess} />
        </CardContent>
      </Card>

      {isChatbotReady && (
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
              <ChatbotPreview stats={chatbotStats} url={chatbotStats.url} />
            </TabsContent>

            <TabsContent value="embed">
              <EmbedCode url={chatbotStats.url} />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsTab />
            </TabsContent>

            <TabsContent value="customize">
              <CustomizeTab />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Crawler;
