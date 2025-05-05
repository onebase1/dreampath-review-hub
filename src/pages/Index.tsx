
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";

const Index = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div>
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Content Review Dashboard</h1>
              <p className="text-gray-300">Manage and review your content in one place</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/chat">
                  Open AI Chat Assistant
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto bg-gray-800 text-white hover:bg-gray-700 border-gray-700">
                <Link to="/crawler">
                  Website Crawler
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* DreaMPATH Banner Section */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                DreaMPATH – All Your OET Subsets. One Seamless Journey.
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Your Dream Starts Here. Practice. Progress. Pass!
              </p>
              <div className="flex gap-4">
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <a href="#" className="text-white">Get Started</a>
                </Button>
                <Button asChild variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  <a href="#" className="text-purple-600">Learn More</a>
                </Button>
              </div>
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <AspectRatio ratio={16 / 9}>
                  {!imageError ? (
                    <img 
                      src="https://i.ibb.co/j98Hpzwk/file.png" 
                      alt="DreaMPATH – OET Mock Practice Online LMS" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load");
                        setImageError(true);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                      <div className="text-center p-4">
                        <p className="text-xl font-bold mb-2">DreaMPATH</p>
                        <p className="text-sm">Image could not be loaded</p>
                      </div>
                    </div>
                  )}
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-2xl font-bold text-center mb-8">AI-Powered Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI Chat Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg animate-fade-in">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-dreampath-dark-purple">AI Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Chat with our intelligent AI assistant to get help with content creation and editing.
                </p>
                <Button asChild className="w-full">
                  <Link to="/chat">Open Chat</Link>
                </Button>
              </div>
            </div>
            
            {/* Website Crawler Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-dreampath-dark-purple">Website Crawler</h3>
                <p className="text-gray-600 mb-4">
                  Generate AI chatbots from any website URL in minutes. Crawl, process, and deploy.
                </p>
                <Button asChild className="w-full">
                  <Link to="/crawler">Create Chatbot</Link>
                </Button>
              </div>
            </div>
            
            {/* Content Dashboard Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-dreampath-dark-purple">Content Dashboard</h3>
                <p className="text-gray-600 mb-4">
                  Review and manage your content with our comprehensive dashboard tools.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="#dashboard">View Dashboard</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dashboard />
    </div>
  );
};

export default Index;
