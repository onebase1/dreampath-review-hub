
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Globe, Code, BarChart2, Settings, CheckCircle, AlertCircle, Loader } from "lucide-react";

const Crawler = () => {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [isChatbotReady, setIsChatbotReady] = useState(false);
  const [chatbotStats, setChatbotStats] = useState({
    pagesCrawled: 0,
    contentExtracted: 0,
    vectorsCreated: 0,
    sampleQuestions: [] as string[]
  });
  const { toast } = useToast();

  const steps = [
    { name: "Validating URL", time: 2 },
    { name: "Crawling Website", time: 15 },
    { name: "Processing Content", time: 10 },
    { name: "Creating Embeddings", time: 20 },
    { name: "Generating Chatbot", time: 13 }
  ];

  const sampleQuestions = [
    "What services do you offer?",
    "How can I contact customer support?",
    "What are your pricing plans?",
    "Do you have any case studies?",
    "What technologies do you use?"
  ];

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Please enter a URL",
        description: "The URL field cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive"
      });
      return;
    }

    // Start the processing simulation
    setIsProcessing(true);
    setCurrentStep(0);
    setProgress(0);
    setIsChatbotReady(false);
    
    // Simulate the crawling process
    simulateProcessing();
  };

  const simulateProcessing = () => {
    let step = 0;
    let totalTime = steps.reduce((sum, step) => sum + step.time, 0);
    let elapsed = 0;
    
    // Reset stats
    setChatbotStats({
      pagesCrawled: 0,
      contentExtracted: 0,
      vectorsCreated: 0,
      sampleQuestions: []
    });

    const interval = setInterval(() => {
      elapsed++;
      const overallProgress = Math.min(Math.floor((elapsed / totalTime) * 100), 100);
      setProgress(overallProgress);
      
      // Calculate estimated time remaining
      setEstimatedTime(Math.max(totalTime - elapsed, 0));
      
      // Update current step when needed
      const timePassed = steps.slice(0, step).reduce((sum, s) => sum + s.time, 0);
      const currentStepTime = steps[step].time;
      
      if (elapsed > timePassed + currentStepTime && step < steps.length - 1) {
        step++;
        setCurrentStep(step);
        
        // Update stats based on current step
        updateStatsForStep(step);
      }
      
      // Finish processing
      if (elapsed >= totalTime) {
        clearInterval(interval);
        setIsProcessing(false);
        setIsChatbotReady(true);
        
        // Final stats update
        setChatbotStats({
          pagesCrawled: 28,
          contentExtracted: 145,  // in KB
          vectorsCreated: 1850,
          sampleQuestions: sampleQuestions
        });
        
        toast({
          title: "Chatbot Created Successfully",
          description: "Your website has been processed and chatbot is ready for use",
        });
      }
    }, 150); // Speed up the simulation for demo
  };

  const updateStatsForStep = (step: number) => {
    // Simulate updating stats based on steps
    switch (step) {
      case 1: // Crawling
        setChatbotStats(prev => ({
          ...prev,
          pagesCrawled: 12
        }));
        break;
      case 2: // Processing
        setChatbotStats(prev => ({
          ...prev,
          pagesCrawled: 28,
          contentExtracted: 78
        }));
        break;
      case 3: // Embeddings
        setChatbotStats(prev => ({
          ...prev,
          contentExtracted: 145,
          vectorsCreated: 920
        }));
        break;
      case 4: // Chatbot
        setChatbotStats(prev => ({
          ...prev,
          vectorsCreated: 1850,
          sampleQuestions: sampleQuestions.slice(0, 3)
        }));
        break;
    }
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
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                disabled={isProcessing}
              />
              <Button 
                type="submit" 
                disabled={isProcessing} 
                className="min-w-[150px]"
              >
                {isProcessing ? 
                  <span className="flex items-center gap-2">
                    <Loader className="animate-spin h-4 w-4" />
                    Processing...
                  </span> : 
                  "Generate Chatbot"
                }
              </Button>
            </div>
            
            {isProcessing && (
              <div className="mt-6 animate-fade-in">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    {steps[currentStep].name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {estimatedTime} seconds remaining
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-2">
                  {steps.map((step, index) => (
                    <div 
                      key={index}
                      className={`flex items-center rounded-lg p-2 gap-2 ${
                        index < currentStep 
                          ? "bg-green-50 text-green-700" 
                          : index === currentStep 
                            ? "bg-blue-50 text-blue-700" 
                            : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : index === currentStep ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-gray-300" />
                      )}
                      <span className="text-xs truncate">{step.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
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
                              {chatbotStats.sampleQuestions.length > 0 && (
                                <div className="bg-dreampath-purple text-white rounded-lg p-3 max-w-[80%] self-end text-sm">
                                  {chatbotStats.sampleQuestions[0]}
                                </div>
                              )}
                              {chatbotStats.sampleQuestions.length > 0 && (
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
                            <span className="font-medium">{chatbotStats.pagesCrawled}</span>
                          </div>
                          <Progress value={100} className="h-1" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Content Extracted</span>
                            <span className="font-medium">{chatbotStats.contentExtracted} KB</span>
                          </div>
                          <Progress value={100} className="h-1" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Vectors Created</span>
                            <span className="font-medium">{chatbotStats.vectorsCreated}</span>
                          </div>
                          <Progress value={100} className="h-1" />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="font-medium text-sm text-gray-700 mb-2">Sample Questions</h3>
                        <ul className="space-y-2">
                          {chatbotStats.sampleQuestions.map((question, index) => (
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
            </TabsContent>
            
            <TabsContent value="embed">
              <Card>
                <CardHeader>
                  <CardTitle>Embed Your Chatbot</CardTitle>
                  <CardDescription>
                    Add this code to your website to include the chatbot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                    <pre className="text-sm">
                      {`<script>
  window.ChatbotConfig = {
    botId: "bot_${Math.random().toString(36).substring(2, 10)}",
    apiKey: "${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}",
    theme: "light",
    position: "bottom-right"
  }
</script>
<script src="https://cdn.dreampath.ai/chatbot.js" async></script>`}
                    </pre>
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1">Copy Code</Button>
                    <Button variant="outline" className="flex-1">Download as HTML</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Monitor your chatbot's performance and user engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Analytics Coming Soon</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      The analytics dashboard will be available once your chatbot has collected some user interactions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="customize">
              <Card>
                <CardHeader>
                  <CardTitle>Customize Appearance</CardTitle>
                  <CardDescription>
                    Personalize your chatbot to match your brand
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bot Name
                      </label>
                      <Input 
                        type="text" 
                        placeholder="Website Assistant" 
                        className="w-full"
                      />
                      
                      <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
                        Welcome Message
                      </label>
                      <Input 
                        type="text" 
                        placeholder="Hello! How can I help you today?" 
                        className="w-full"
                      />
                      
                      <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
                        Chat Icon
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div 
                            key={i} 
                            className={`bg-gray-100 rounded-md h-12 flex items-center justify-center cursor-pointer ${i === 1 ? 'ring-2 ring-dreampath-purple' : ''}`}
                          >
                            <div className={`w-6 h-6 rounded-full ${i === 1 ? 'bg-dreampath-purple' : 'bg-gray-400'}`}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Theme
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['#9b87f5', '#4CAF50', '#ea384c', '#2196F3', '#FF9800', '#000000'].map((color) => (
                          <div 
                            key={color} 
                            className={`h-12 rounded-md cursor-pointer ${color === '#9b87f5' ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      
                      <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
                        Position
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {['bottom-right', 'bottom-left'].map((pos) => (
                          <div 
                            key={pos} 
                            className={`border rounded-md p-3 text-center cursor-pointer ${pos === 'bottom-right' ? 'bg-gray-100 border-gray-300' : ''}`}
                          >
                            <span className="text-sm">{pos.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full">Save Customizations</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Crawler;
