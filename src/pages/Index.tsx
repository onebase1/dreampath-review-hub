
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";

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
      <Dashboard />
    </div>
  );
};

export default Index;
