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
    contentExtracted: 0,
    vectorsCreated: 0,
    sampleQuestions: [] as string[],
    url: ""
  });

  const handleCrawlSuccess = (data: CrawlResponse) => {
    // Update the stats display with proper type handling
    setChatbotStats({
      // Convert to number if it's a string
      pagesCrawled: typeof data.stats.pagesCrawled === 'string' 
        ? parseInt(data.stats.pagesCrawled, 10) || 0
        : data.stats.pagesCrawled || 0,
        
      // Keep content extracted as is
      contentExtracted: data.stats.contentExtracted,
      
      // Convert to number if it's a string
      vectorsCreated: typeof data.stats.vectorsCreated === 'string'
        ? parseInt(data.stats.vectorsCreated, 10) || 0 
        : data.stats.vectorsCreated || 0,
        
      sampleQuestions: data.sampleQuestions || [],
      url: data.url
    });
    
    // Show completion and set chatbot ready
    setIsChatbotReady(true);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Website Crawler & Chatbot Generator</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create an AI-powered chatbot from any website in <span className="font-semibold text-dreampath-dark-purple">under 2 minutes</span>.
          Just enter the URL and we'll do the rest.
        </p>
      </div>
      
      <Card className="mb-8 border-2 border-gray-100 shadow-lg">
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
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="embed" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>Embed</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="customize" className="flex items-center gap-2">
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
