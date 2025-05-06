
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { CheckCircle } from "lucide-react";

interface CrawlerFormProps {
  onSuccess: (data: CrawlResponse) => void;
}

// Interface for the crawler response
export interface CrawlResponse {
  success: boolean;
  stats: {
    pagesCrawled: number;
    contentExtracted: string;
    vectorsCreated: number;
  };
  url: string;
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

  // Properly validate URLs
  const validateUrl = (input: string) => {
    // If URL already has protocol, use it as is
    let urlToCheck = input.trim();
    
    // Simple check to ensure it has a valid protocol
    if (!/^https?:\/\//i.test(urlToCheck)) {
      return false;
    }
    
    try {
      new URL(urlToCheck);
      return true;
    } catch (e) {
      return false;
    }
  };

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
        body: JSON.stringify({ url: url }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Process the response directly instead of polling
      const data: CrawlResponse = await response.json();
      
      if (data.success) {
        // Simulate processing steps for better UX
        simulateProcessingSteps(() => {
          onSuccess({
            ...data,
            url
          });
        });
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

  // Simulate processing steps for a better UX
  const simulateProcessingSteps = (onComplete: () => void) => {
    let step = 0;
    let progress = 0;
    let remainingTime = steps.reduce((total, step) => total + step.time, 0);
    
    const interval = setInterval(() => {
      if (step >= steps.length) {
        clearInterval(interval);
        setIsProcessing(false);
        onComplete();
        
        toast({
          title: "Chatbot Created Successfully",
          description: "Your website has been processed and chatbot is ready for use",
        });
        return;
      }
      
      setCurrentStep(step);
      
      // Calculate progress percentage across all steps
      const stepProgress = (progress % 100) / 100;
      const overallProgress = Math.min(
        ((step + stepProgress) / steps.length) * 100, 
        99
      );
      
      setProgress(overallProgress);
      
      // Update remaining time
      remainingTime = Math.max(0, remainingTime - 0.1);
      setEstimatedTime(Math.round(remainingTime));
      
      // Increment progress within the current step
      progress += 5;
      if (progress >= 100) {
        progress = 0;
        step++;
      }
    }, 100);
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
    </div>
  );
};
