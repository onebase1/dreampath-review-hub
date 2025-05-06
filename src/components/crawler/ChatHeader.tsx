
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

interface ChatHeaderProps {
  isChatActivated: boolean;
  questionsRemaining: number;
}

export const ChatHeader = ({ isChatActivated, questionsRemaining }: ChatHeaderProps) => {
  return (
    <div className="bg-dreampath-purple p-3 flex items-center justify-between text-white">
      <div className="flex items-center">
        <MessageSquare className="h-5 w-5 mr-2" />
        <div className="font-medium">Website Assistant</div>
      </div>
      <Badge variant="secondary" className="text-xs bg-white/20 hover:bg-white/30">
        {isChatActivated 
          ? `${questionsRemaining}/5 Questions` 
          : "Preview Mode"}
      </Badge>
    </div>
  );
};
