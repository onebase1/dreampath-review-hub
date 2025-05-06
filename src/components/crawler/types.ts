
// Interface for the crawler response
export interface CrawlResponse {
  success: boolean;
  message?: string;
  questions?: string[];
  url?: string;
  originalUrl?: string;
  sampleQuestions?: string[]; 
  stats: {
    pagesCrawled: number | string;
    contentExtracted: string | number;
    vectorsCreated: number | string;
  } | number[] | string;
}

// Props interface for CrawlerForm
export interface CrawlerFormProps {
  onSuccess: (data: CrawlResponse) => void;
}

// Progress step interface
export interface ProgressStep {
  name: string;
  time: number;
}
