
/**
 * Simulates processing steps for a better UX
 * @param steps Processing steps with estimated times
 * @param onStepChange Callback when step changes
 * @param onProgressChange Callback for progress updates
 * @param onTimeChange Callback for time updates
 * @param onComplete Callback when simulation completes
 */
export const simulateProcessingSteps = (
  steps: Array<{ name: string; time: number }>,
  onStepChange: (step: number) => void,
  onProgressChange: (progress: number) => void,
  onTimeChange: (time: number) => void,
  onComplete: () => void
) => {
  let step = 0;
  let progress = 0;
  let remainingTime = steps.reduce((total, step) => total + step.time, 0);
  
  const interval = setInterval(() => {
    if (step >= steps.length) {
      clearInterval(interval);
      onComplete();
      return;
    }
    
    onStepChange(step);
    
    // Calculate progress percentage across all steps
    const stepProgress = (progress % 100) / 100;
    const overallProgress = Math.min(
      ((step + stepProgress) / steps.length) * 100, 
      99
    );
    
    onProgressChange(overallProgress);
    
    // Update remaining time
    remainingTime = Math.max(0, remainingTime - 0.1);
    onTimeChange(Math.round(remainingTime));
    
    // Increment progress within the current step
    progress += 5;
    if (progress >= 100) {
      progress = 0;
      step++;
    }
  }, 100);

  // Return a function to clear the interval if needed
  return () => clearInterval(interval);
};
