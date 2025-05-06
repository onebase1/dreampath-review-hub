
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AnalyticsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
        <CardDescription>
          Monitor your chatbot's performance and user engagement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-800 mb-2">Analytics Coming Soon</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            The analytics dashboard will be available once your chatbot has collected some user interactions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
