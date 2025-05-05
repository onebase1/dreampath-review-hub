
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface MessageProps {
  message: {
    id: string;
    content: string;
    type: "text" | "image" | "video";
    isUser: boolean;
    timestamp?: string;
  };
}

const ChatMessage = ({ message }: MessageProps) => {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Determine if URL is valid
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  // Format the URL if needed
  const getFormattedUrl = (url: string): string => {
    if (!isValidUrl(url)) {
      // Try to extract URL from string if it contains a URL
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const match = url.match(urlRegex);
      if (match) {
        url = match[0];
      }
    }
    
    // Handle Google Drive links
    if (url.includes('drive.google.com/file/d/')) {
      // Extract file ID from the Google Drive link
      const fileIdMatch = url.match(/\/d\/(.*?)\/view/);
      if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        return `https://drive.google.com/uc?id=${fileId}&export=download`;
      }
    }

    return url;
  };

  const renderContent = () => {
    if (message.type === "image") {
      const imageUrl = getFormattedUrl(message.content);
      
      return imageError ? (
        <div className="bg-gray-100 rounded p-4 text-red-500 text-sm">
          Failed to load image. URL: {message.content}
        </div>
      ) : (
        <div className="max-w-xs sm:max-w-md">
          <AspectRatio ratio={16 / 9}>
            <img 
              src={imageUrl} 
              alt="Generated content" 
              className="rounded-lg object-cover w-full h-full"
              onError={() => setImageError(true)} 
            />
          </AspectRatio>
        </div>
      );
    } else if (message.type === "video") {
      const videoUrl = getFormattedUrl(message.content);
      
      return videoError ? (
        <div className="bg-gray-100 rounded p-4 text-red-500 text-sm">
          Failed to load video. URL: {message.content}
        </div>
      ) : (
        <div className="max-w-xs sm:max-w-md">
          <AspectRatio ratio={16 / 9}>
            <video 
              src={videoUrl} 
              controls 
              className="rounded-lg w-full h-full"
              onError={() => setVideoError(true)}
            >
              Your browser does not support video playback.
            </video>
          </AspectRatio>
        </div>
      );
    } else {
      // Text content
      return <p className="whitespace-pre-wrap">{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3/4 p-3 rounded-lg ${
          message.isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-white border border-gray-200 rounded-bl-none"
        }`}
      >
        {renderContent()}
        {message.timestamp && (
          <div className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
