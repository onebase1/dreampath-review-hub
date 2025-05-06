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
    contentExtracted: "", // Changed to string type
    vectorsCreated: 0,
    sampleQuestions: [] as string[],
    url: ""
  });

  const handleCrawlSuccess = (data: CrawlResponse) => {
    // Preserve the original URL from the data or use the one from the response
    const originalUrl = data.originalUrl || data.url || "https://example.com";

    // Parse stats if it's a string
    let statsObj = data.stats;
    if (typeof data.stats === 'string') {
      try {
        statsObj = JSON.parse(data.stats);
      } catch (e) {
        console.error("Failed to parse stats:", e);
        statsObj = {
          pagesCrawled: 0,
          contentExtracted: "0 KB",
          vectorsCreated: 0
        };
      }
    }

    // Parse sample questions if it's a string
    let questionsArray = data.sampleQuestions || [];
    if (typeof data.sampleQuestions === 'string') {
      try {
        questionsArray = JSON.parse(data.sampleQuestions);
      } catch (e) {
        console.error("Failed to parse sample questions:", e);
        questionsArray = [];
      }
    }

    // Update the stats display with proper type handling
    setChatbotStats({
      // Ensure pagesCrawled is always a number
      pagesCrawled: typeof statsObj.pagesCrawled === 'string'
        ? Number(statsObj.pagesCrawled) || 0
        : Number(statsObj.pagesCrawled) || 0,

      // Content extracted comes in as a string like "145 KB"
      contentExtracted: String(statsObj.contentExtracted || "0 KB"),

      // Ensure vectorsCreated is always a number
      vectorsCreated: typeof statsObj.vectorsCreated === 'string'
        ? Number(statsObj.vectorsCreated) || 0
        : Number(statsObj.vectorsCreated) || 0,

      sampleQuestions: questionsArray,
      // Use the original URL to ensure consistency
      url: originalUrl
    });

    // Show completion and set chatbot ready
    setIsChatbotReady(true);

    // Log the URL for debugging
    console.log("Using URL for chatbot:", originalUrl);
    console.log("Stats:", statsObj);
    console.log("Sample questions:", questionsArray);
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
