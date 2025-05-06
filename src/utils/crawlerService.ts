
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

  try {
    // Send the request to the webhook
    const response = await fetch('http://localhost:5678/webhook-test/index', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: processedUrl // Send just the URL string as plain text
    });
    
    console.log("Webhook request sent to:", 'http://localhost:5678/webhook-test/index');
    console.log("With body:", processedUrl);
    
    // Handle the actual response if available
    let data;
    try {
      // Try to parse the response as JSON
      data = await response.json();
      console.log("Webhook response received:", data);
    } catch (err) {
      console.warn("Could not parse webhook response as JSON, using mock data instead");
      // If parsing fails, use mock data
      data = null;
    }
    
    // If we have valid data from the webhook, use it
    if (data && data.success) {
      return {
        success: data.success,
        message: data.message || "Website successfully crawled",
        questions: data.questions || [],
        url: processedUrl,
        originalUrl: processedUrl,
        sampleQuestions: data.questions || [],
        stats: data.stats || {
          pagesCrawled: 5,
          contentExtracted: "150 KB",
          vectorsCreated: 120
        }
      };
    }
    
    // Fallback to mock data if no valid response received
    console.log("Using mock response data for development");
    // Simulate API delay for testing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
    
  } catch (err) {
    console.error("Error with webhook request:", err);
    
    // Even on error, return mock data for development purposes
    // In production, you might want to throw the error instead
    console.log("Using mock response data after error");
    
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
    
    return {
      success: mockResponse.success,
      message: mockResponse.message,
      questions: mockResponse.questions || [],
      url: mockResponse.url || processedUrl,
      originalUrl: processedUrl,
      sampleQuestions: mockResponse.questions || [],
      stats: mockResponse.stats
    };
  }
};
