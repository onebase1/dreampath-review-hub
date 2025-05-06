
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, ArrowRight } from "lucide-react";

interface WebsiteDataProps {
  stats: {
    pagesCrawled: number;
    contentExtracted: string | number;
    vectorsCreated: number;
    sampleQuestions: string[];
  };
  onSampleQuestionClick: (question: string) => void;
}

export const WebsiteData = ({ stats, onSampleQuestionClick }: WebsiteDataProps) => {
  // Format content extracted based on its type
  const formatContentExtracted = () => {
    if (typeof stats.contentExtracted === 'number') {
      return `${stats.contentExtracted} KB`;
    }
    return stats.contentExtracted;
  };

  // Ensure sampleQuestions is an array for safe rendering
  const questions = Array.isArray(stats.sampleQuestions) ? stats.sampleQuestions : [];

  return (
    <Card className="h-full shadow-md border-gray-100">
      <CardHeader>
        <CardTitle>Website Data</CardTitle>
        <CardDescription>
          Information extracted from your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Pages Crawled</span>
              <span className="font-medium">{stats.pagesCrawled}</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Content Extracted</span>
              <span className="font-medium">{formatContentExtracted()}</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Vectors Created</span>
              <span className="font-medium">{stats.vectorsCreated}</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">Sample Questions</h3>
            <ScrollArea className="h-[180px]">
              <ul className="space-y-2">
                {questions && questions.length > 0 ? (
                  questions.map((question, index) => (
                    <li
                      key={index}
                      className="bg-gray-50 p-2 rounded text-sm flex items-start cursor-pointer hover:bg-gray-100 transition-colors group"
                      onClick={() => onSampleQuestionClick(question)}
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span>{question}</span>
                      <ArrowRight className="h-3 w-3 ml-1 mt-0.5 opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity" />
                    </li>
                  ))
                ) : (
                  <li className="bg-gray-50 p-2 rounded text-sm">
                    <span>No sample questions available</span>
                  </li>
                )}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
