
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { processCrawlerUrl } from "@/utils/crawlerService";
import { CrawlStepsProgress } from "./CrawlStepsProgress";
import { CrawlResponse, CrawlerFormProps, ProgressStep } from "./types";

export { type CrawlResponse } from "./types";

export const CrawlerForm = ({ onSuccess }: CrawlerFormProps) => {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const steps: ProgressStep[] = [
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

    // Start the processing
    setIsProcessing(true);
    setCurrentStep(0);
    setProgress(0);

    console.log("Submitting URL:", url);
    
    // Progress simulation helper
    const progressInterval = simulateProgressWhileWaiting();

    try {
      const response = await processCrawlerUrl(url);
      
      // Clear the progress simulation
      clearInterval(progressInterval);
      setProgress(100);
      
      // Call onSuccess with the response data
      onSuccess(response);

      toast({
        title: "Success!",
        description: response.message || "Website successfully processed",
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
