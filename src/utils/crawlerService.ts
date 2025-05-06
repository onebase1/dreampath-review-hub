
import { validateUrl } from "./urlValidator";
import { CrawlResponse } from "@/components/crawler/types";

/**
 * Process a URL with the crawler service
 */
export const processCrawlerUrl = async (url: string): Promise<CrawlResponse> => {
  // Prepare the URL - ensure it has http:// or https:// prefix
  let processedUrl = url.trim();
  if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
    processedUrl = 'https://' + processedUrl;
  }

  if (!validateUrl(processedUrl)) {
    throw new Error("Please enter a valid URL");
  }

  console.log("Processing URL:", processedUrl);

  // Attempt the real API call but with no-cors mode
  // Note: This is a "fire and forget" approach as no-cors won't return usable data
  fetch('http://localhost:5678/webhook-test/index', {
    method: 'POST',
    headers: { 
      'Content-Type': 'text/plain' // Changed to text/plain for sending just the URL
    },
    mode: 'no-cors', // This prevents CORS errors but won't return usable data
    body: processedUrl // Send just the URL as a string
  }).catch(err => console.log("CORS request attempted:", err));
  
  // For development, simulate a successful response with mock data
  // In production, you'd replace this with the real API response
  await new Promise(resolve => setTimeout(resolve, 4000)); // Simulate API delay
  
  // Mock response shaped like the expected API response
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
    stats: {
      pagesCrawled: 5,
      contentExtracted: "150 KB",
      vectorsCreated: 120
    }
  };
  
  // Format the response to match what the component expects
  return {
    success: mockResponse.success,
    message: mockResponse.message,
    questions: mockResponse.questions || [],
    url: mockResponse.url || processedUrl,
    originalUrl: processedUrl,
    sampleQuestions: mockResponse.questions || [],
    stats: mockResponse.stats
  };
};
