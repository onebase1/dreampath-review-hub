
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { validateUrl } from "@/utils/urlValidator";
import { CrawlStepsProgress } from "./CrawlStepsProgress";

interface CrawlerFormProps {
  onSuccess: (data: CrawlResponse) => void;
}

// Interface for the crawler response
export interface CrawlResponse {
  success: boolean;
  message?: string;
  stats: number[] | { 
    pagesCrawled: number | string;
    contentExtracted: string | number;
    vectorsCreated: number | string;
  } | string;
  questions?: string[];
  url?: string;
  originalUrl?: string;
  sampleQuestions?: string[]; // Add this property to fix the error
}

export const CrawlerForm = ({ onSuccess }: CrawlerFormProps) => {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
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
    
    // Progress simulation helper
    const progressInterval = simulateProgressWhileWaiting();

    try {
      // Make actual API call to n8n webhook
      const response = await fetch('http://localhost:5678/webhook-test/index', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          url: processedUrl,
          originalUrl: processedUrl 
        })
      });
      
      // Clear the progress simulation
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (!data.success) {
        throw new Error(data.message || 'Processing failed');
      }
      
      // Successfully processed
      setProgress(100);
      
      // Format the response to match what the parent component expects
      const formattedResponse: CrawlResponse = {
        ...data,
        url: data.url || processedUrl,
        originalUrl: processedUrl,
        // Make sure questions property is set correctly
        questions: data.questions || [],
        // Make sure sampleQuestions is set, using questions as fallback
        sampleQuestions: data.questions || []
      };
      
      // Call onSuccess with the formatted response data
      onSuccess(formattedResponse);

      toast({
        title: "Success!",
        description: data.message || "Website successfully processed",
      });

    } catch (error) {
      // Clear progress simulation
      clearInterval(progressInterval);
      
      console.error('Error submitting URL:', error);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Progress simulation helper
  const simulateProgressWhileWaiting = () => {
    let progress = 0;
    return setInterval(() => {
      progress += 1;
      if (progress <= 95) {
        setProgress(progress);
        
        // Update current step based on progress
        if (progress < 20) setCurrentStep(0);
        else if (progress < 40) setCurrentStep(1);
        else if (progress < 60) setCurrentStep(2);
        else if (progress < 80) setCurrentStep(3);
        else setCurrentStep(4);
      }
    }, 500);
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
        estimatedTime={0}
        steps={steps}
      />
    </div>
  );
};
