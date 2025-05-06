
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface EmbedCodeProps {
  url: string;
}

export const EmbedCode = ({ url }: EmbedCodeProps) => {
  const { toast } = useToast();
  
  // Function to copy embed code to clipboard
  const copyEmbedCode = () => {
    const embedCode = document.querySelector('pre')?.textContent || '';
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied to clipboard",
      description: "The embed code has been copied to your clipboard"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Your Chatbot</CardTitle>
        <CardDescription>
          Add this code to your website to include the chatbot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
          <pre className="text-sm">
            {`<script>
  window.ChatbotConfig = {
    botId: "bot_${Math.random().toString(36).substring(2, 10)}",
    apiKey: "${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}",
    theme: "light",
    position: "bottom-right",
    sourceUrl: "${url}"
  }
</script>
<script src="https://cdn.dreampath.ai/chatbot.js" async></script>`}
          </pre>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button 
            className="flex-1"
            onClick={copyEmbedCode}
          >
            Copy Code
          </Button>
          <Button variant="outline" className="flex-1">Download as HTML</Button>
        </div>
      </CardContent>
    </Card>
  );
};
