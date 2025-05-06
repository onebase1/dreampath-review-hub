
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader, CheckCircle } from "lucide-react";

interface CrawlStep {
  name: string;
  time: number;
}

interface CrawlStepsProgressProps {
  isProcessing: boolean;
  currentStep: number;
  progress: number;
  estimatedTime: number;
  steps: CrawlStep[];
}

export const CrawlStepsProgress = ({
  isProcessing,
  currentStep,
  progress,
  estimatedTime,
  steps,
}: CrawlStepsProgressProps) => {
  if (!isProcessing) return null;

  return (
    <div className="mt-6 animate-fade-in">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">
          {steps[currentStep]?.name || "Processing"}
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
  );
};
