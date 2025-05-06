
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";
import { ArrowRight, CheckCircle } from "lucide-react";

interface ChatInputProps {
  isChatActivated: boolean;
  isLoading: boolean;
  sampleQuestions: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onSampleQuestionClick: (question: string) => void;
  onActivateChat: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export const ChatInput = ({
  isChatActivated,
  isLoading,
  sampleQuestions,
  inputValue,
  onInputChange,
  onSendMessage,
  onSampleQuestionClick,
  onActivateChat,
  handleKeyPress
}: ChatInputProps) => {
  return (
    <>
      <Separator />
      <div className="p-3 bg-white">
        <p className="text-xs text-gray-500 mb-2">Try asking about:</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {sampleQuestions.slice(0, 3).map((question, index) => (
            <div
              key={index}
              className="bg-gray-100 hover:bg-gray-200 text-xs p-2 rounded-full cursor-pointer transition-colors"
              onClick={() => onSampleQuestionClick(question)}
            >
              {question.length > 30 ? question.substring(0, 30) + '...' : question}
            </div>
          ))}
          {sampleQuestions.length > 3 && (
            <div className="bg-gray-100 text-xs p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
              +{sampleQuestions.length - 3} more
            </div>
          )}
        </div>
        
        {/* Input field or activation button */}
        {isChatActivated ? (
          <div className="mt-3 flex items-center">
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 border rounded-l-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-dreampath-purple"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className={`${
                isLoading 
                  ? 'bg-gray-400' 
                  : 'bg-dreampath-purple hover:bg-dreampath-dark-purple'
              } text-white px-4 py-2 rounded-r-md text-sm flex items-center transition-colors`}
              onClick={onSendMessage}
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Button 
            onClick={onActivateChat}
            className="w-full mt-3 bg-dreampath-purple hover:bg-dreampath-dark-purple"
          >
            Try it now
          </Button>
        )}
      </div>
    </>
  );
};
