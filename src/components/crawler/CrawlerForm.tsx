
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { validateUrl } from "@/utils/urlValidator";
import { simulateProcessingSteps } from "@/utils/crawlSimulator";
import { CrawlStepsProgress } from "./CrawlStepsProgress";

interface CrawlerFormProps {
  onSuccess: (data: CrawlResponse) => void;
}

// Interface for the crawler response
export interface CrawlResponse {
  success: boolean | string; // Can be "true" as a string
  stats: {
    pagesCrawled: number | string;
    contentExtracted: string | number;
    vectorsCreated: number | string;
  } | string; // Stats can be returned as a JSON string
  url: string | null; // URL can be null
  originalUrl?: string; // Added to preserve the original URL entered by the user
  sampleQuestions: string[] | string; // Sample questions can be returned as a JSON string

  // For direct Knowledge Tool responses
  response?: Array<{
    pageContent?: string;
    metadata?: any;
  }>;
}

export const CrawlerForm = ({ onSuccess }: CrawlerFormProps) => {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const { toast } = useToast();

  const steps = [
    { name: "Validating URL", time: 2 },
    { name: "Crawling Website", time: 15 },
    { name: "Processing Content", time: 10 },
    { name: "Creating Embeddings", time: 20 },
    { name: "Generating Chatbot", time: 13 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast({
        title: "Please enter a URL",
        description: "The URL field cannot be empty",
        variant: "destructive"
      });
      return;
    }

    // Prepare the URL - ensure it has http:// or https:// prefix
    let processedUrl = url.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }

    if (!validateUrl(processedUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    // Start the processing
    setIsProcessing(true);
    setCurrentStep(0);
    setProgress(0);

    console.log("Submitting URL:", processedUrl);

    try {
      // Update API endpoint to match n8n webhook configuration
      const response = await fetch('http://localhost:5678/webhook-test/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: processedUrl,
          // Add the original URL as a separate field to ensure it's preserved
          originalUrl: processedUrl
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Process the response directly instead of polling
      const data: CrawlResponse = await response.json();
      console.log("Response data:", data);

      // Check if we have a response object from the Knowledge Tool
      if (data.response && Array.isArray(data.response)) {
        console.log("Knowledge Tool response detected");

        // Create a synthetic success response
        const syntheticData: CrawlResponse = {
          success: true,
          stats: {
            pagesCrawled: data.response.length,
            contentExtracted: `${Math.round(data.response.reduce((acc, item) => acc + (item.pageContent?.length || 0), 0) / 1024)} KB`,
            vectorsCreated: data.response.length
          },
          url: processedUrl,
          originalUrl: processedUrl,
          sampleQuestions: [
            "What services do you offer?",
            "How can I contact you?",
            "What are your business hours?",
            "Where are you located?",
            "Do you have any special offers?"
          ]
        };

        // Simulate processing steps for better UX
        simulateProcessingSteps(
          steps,
          setCurrentStep,
          setProgress,
          setEstimatedTime,
          () => {
            setIsProcessing(false);
            onSuccess(syntheticData);

            toast({
              title: "Chatbot Created Successfully",
              description: "Your website has been processed and chatbot is ready for use",
            });
          }
        );
      } else if (data.success) {
        // Regular success response format
        // Simulate processing steps for better UX
        simulateProcessingSteps(
          steps,
          setCurrentStep,
          setProgress,
          setEstimatedTime,
          () => {
            setIsProcessing(false);
            onSuccess({
              ...data,
              url: data.url || processedUrl,
              originalUrl: processedUrl // Pass the processed URL
            });

            toast({
              title: "Chatbot Created Successfully",
              description: "Your website has been processed and chatbot is ready for use",
            });
          }
        );
      } else {
        throw new Error("Processing failed");
      }

    } catch (error) {
      console.error('Error submitting URL:', error);
      toast({
        title: "Error Processing Website",
        description: `There was an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
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
          onClick={handleSubmit}
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

      <CrawlStepsProgress
        isProcessing={isProcessing}
        currentStep={currentStep}
        progress={progress}
        estimatedTime={estimatedTime}
        steps={steps}
      />
    </div>
  );
};
