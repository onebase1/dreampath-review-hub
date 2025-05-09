
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface MessageProps {
  message: {
    id: string;
    content: string;
    type: "text" | "image" | "video";
    isUser: boolean;
    timestamp?: string;
  };
  onSelectImage?: (url: string) => void;
}

const ChatMessage = ({ message, onSelectImage }: MessageProps) => {
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
    
    // Handle already formatted Google Drive links with id parameter
    if (url.includes('drive.google.com/uc?id=')) {
      return url;
    }

    // Handle markdown link format [text](url)
    const markdownLinkRegex = /\[(.*?)\]\((https?:\/\/[^\s)]+)\)/;
    const markdownMatch = url.match(markdownLinkRegex);
    if (markdownMatch && markdownMatch[2]) {
      // Extract the URL from the markdown link
      const extractedUrl = markdownMatch[2];
      // Check if it's a Google Drive link and process accordingly
      if (extractedUrl.includes('drive.google.com/file/d/')) {
        const fileIdMatch = extractedUrl.match(/\/d\/(.*?)\/view/);
        if (fileIdMatch && fileIdMatch[1]) {
          const fileId = fileIdMatch[1];
          return `https://drive.google.com/uc?id=${fileId}&export=download`;
        }
      } else if (extractedUrl.includes('drive.google.com/uc?id=')) {
        return extractedUrl;
      }
      return extractedUrl;
    }

    return url;
  };

  // Extract image URL from markdown format if present
  const extractImageFromMarkdown = (content: string) => {
    const markdownLinkRegex = /\[(.*?)\]\((https?:\/\/[^\s)]+)\)/;
    const match = content.match(markdownLinkRegex);
    if (match) {
      return {
        altText: match[1],
        imageUrl: match[2]
      };
    }
    return null;
  };

  const renderContent = () => {
    if (message.type === "image") {
      const imageUrl = getFormattedUrl(message.content);
      
      return imageError ? (
        <div className="bg-gray-100 rounded p-4 text-red-500 text-sm">
          Failed to load image. URL: {message.content}
          <div className="mt-2">
            <a 
              href={imageUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-500 hover:underline"
            >
              Open image in new tab
            </a>
          </div>
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
          {onSelectImage && (
            <div className="mt-2 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSelectImage(imageUrl)}
                className="text-xs flex items-center gap-1"
              >
                <Edit2 size={14} />
                Edit this image
              </Button>
            </div>
          )}
        </div>
      );
    } else if (message.type === "video") {
      const videoUrl = getFormattedUrl(message.content);
      
      return videoError ? (
        <div className="bg-gray-100 rounded p-4 text-red-500 text-sm">
          Failed to load video. URL: {message.content}
          <div className="mt-2">
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-500 hover:underline"
            >
              Open video in new tab
            </a>
          </div>
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
      // Check if text content contains a markdown image link
      const content = message.content;
      const markdownImage = extractImageFromMarkdown(content);
      
      if (markdownImage) {
        return (
          <div>
            <p className="whitespace-pre-wrap mb-4">
              {message.content.replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/, `${markdownImage.altText}`)}
            </p>
            <div className="max-w-xs sm:max-w-md">
              <AspectRatio ratio={16 / 9} className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={markdownImage.imageUrl} 
                  alt={markdownImage.altText} 
                  className="rounded-lg object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    setImageError(true);
                  }} 
                />
              </AspectRatio>
              {imageError && (
                <div className="mt-2 text-red-500 text-sm">
                  Failed to load image. <a href={markdownImage.imageUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Open in new tab</a>
                </div>
              )}
              {onSelectImage && !imageError && (
                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onSelectImage(markdownImage.imageUrl)}
                    className="text-xs flex items-center gap-1"
                  >
                    <Edit2 size={14} />
                    Edit this image
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      }
      
      // Check if text content contains a link that might be an image or video
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const matches = content.match(urlRegex);
      
      if (matches && (
        matches.some(match => match.includes('drive.google.com')) || 
        content.includes('[Click here to view') || 
        content.includes('[View the image')
      )) {
        const url = getFormattedUrl(content);
        
        // Try to display as image
        return (
          <div>
            <p className="whitespace-pre-wrap mb-4">{content}</p>
            <AspectRatio ratio={16 / 9} className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
              <img 
                src={url} 
                alt="Generated content" 
                className="rounded-lg object-cover w-full h-full"
                onError={(e) => {
                  // If image fails, hide the broken image
                  e.currentTarget.style.display = 'none';
                }} 
              />
            </AspectRatio>
            <div className="mt-2 flex justify-between items-center">
              <a 
                href={url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-500 hover:underline text-sm"
              >
                Open in new tab
              </a>
              {onSelectImage && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onSelectImage(url)}
                  className="text-xs flex items-center gap-1"
                >
                  <Edit2 size={14} />
                  Edit this image
                </Button>
              )}
            </div>
          </div>
        );
      }
      
      // Regular text content
      return <p className="whitespace-pre-wrap">{content}</p>;
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

