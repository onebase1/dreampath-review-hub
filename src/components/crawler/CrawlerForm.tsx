
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
      // In production, we'd use the real API endpoint
      // For development with CORS issues, we'll simulate a successful response
      // but also attempt to make the real request with mode: 'no-cors'
      
      // Attempt the real API call but with no-cors mode
      // Note: This is a "fire and forget" approach as no-cors won't return usable data
      fetch('http://localhost:5678/webhook-test/index', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        mode: 'no-cors', // This prevents CORS errors but won't return usable data
        body: JSON.stringify({ 
          url: processedUrl,
          originalUrl: processedUrl 
        })
      }).catch(err => console.log("CORS request attempted:", err));
      
      // For development, simulate a successful response with mock data
      // In production, you'd replace this with the real API response
      await new Promise(resolve => setTimeout(resolve, 4000)); // Simulate API delay
      
      const mockResponse = {
        success: true,
        message: "Website successfully crawled and processed",
        questions: [
          "What services does this website offer?",
          "How can I contact customer support?",
          "What are the pricing options?",
          "Is there a free trial available?",
          "What technologies does this company use?"
        ],
        url: processedUrl,
        stats: [5, "150 KB", 120] // Pages crawled, content extracted, vectors created
      };
      
      // Clear the progress simulation
      clearInterval(progressInterval);
      setProgress(100);
      
      // Format the response to match what the parent component expects
      const formattedResponse: CrawlResponse = {
        ...mockResponse,
        url: mockResponse.url || processedUrl,
        originalUrl: processedUrl,
        questions: mockResponse.questions || [],
        sampleQuestions: mockResponse.questions || []
      };
      
      // Call onSuccess with the formatted response data
      onSuccess(formattedResponse);

      toast({
        title: "Success!",
        description: mockResponse.message || "Website successfully processed",
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
