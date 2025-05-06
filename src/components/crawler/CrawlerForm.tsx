
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
  success: boolean;
  stats: {
    pagesCrawled: number | string;
    contentExtracted: string | number;
    vectorsCreated: number | string;
  };
  url: string;
  originalUrl?: string; // Added to preserve the original URL entered by the user
  sampleQuestions: string[];
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

    if (!validateUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive"
      });
      return;
    }

    // Start the processing
    setIsProcessing(true);
    setCurrentStep(0);
    setProgress(0);

    try {
      // Update API endpoint to match n8n webhook configuration
      const response = await fetch('http://localhost:5678/webhook-test/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          // Add the original URL as a separate field to ensure it's preserved
          originalUrl: url
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Process the response directly instead of polling
      const data: CrawlResponse = await response.json();

      if (data.success) {
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
              url: data.url,
              originalUrl: url // Pass the original URL entered by the user
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
