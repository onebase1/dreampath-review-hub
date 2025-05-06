
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CustomizeTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Appearance</CardTitle>
        <CardDescription>
          Personalize your chatbot to match your brand
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bot Name
            </label>
            <Input 
              type="text" 
              placeholder="Website Assistant" 
              className="w-full"
            />
            
            <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
              Welcome Message
            </label>
            <Input 
              type="text" 
              placeholder="Hello! How can I help you today?" 
              className="w-full"
            />
            
            <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
              Chat Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`bg-gray-100 rounded-md h-12 flex items-center justify-center cursor-pointer ${i === 1 ? 'ring-2 ring-dreampath-purple' : ''}`}
                >
                  <div className={`w-6 h-6 rounded-full ${i === 1 ? 'bg-dreampath-purple' : 'bg-gray-400'}`}></div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['#9b87f5', '#4CAF50', '#ea384c', '#2196F3', '#FF9800', '#000000'].map((color) => (
                <div 
                  key={color} 
                  className={`h-12 rounded-md cursor-pointer ${color === '#9b87f5' ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
              Position
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['bottom-right', 'bottom-left'].map((pos) => (
                <div 
                  key={pos} 
                  className={`border rounded-md p-3 text-center cursor-pointer ${pos === 'bottom-right' ? 'bg-gray-100 border-gray-300' : ''}`}
                >
                  <span className="text-sm">{pos.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button className="w-full">Save Customizations</Button>
        </div>
      </CardContent>
    </Card>
  );
};
