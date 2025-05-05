
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Index = () => {
  return (
    <div>
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Content Review Dashboard</h1>
              <p className="text-gray-300">Manage and review your content in one place</p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/chat">
                Open AI Chat Assistant
              </Link>
            </Button>
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
                  <img 
                    src="https://drive.google.com/uc?id=1epXnnETqqBAHiN1LJt7MuDA88LNBmqLH&export=download" 
                    alt="DreaMPATH – OET Mock Practice Online LMS" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("Image failed to load");
                      e.currentTarget.src = "https://placehold.co/600x400?text=DreaMPATH";
                    }}
                  />
                </AspectRatio>
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
