
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateUserInfo } from "@/services/chatbotService";

interface LeadCaptureFormProps {
  sessionId: string;
  onSuccess: () => void;
}

export const LeadCaptureForm = ({ sessionId, onSuccess }: LeadCaptureFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast({
        title: "Missing information",
        description: "Please provide your name and email address",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await updateUserInfo(sessionId, { name, email, company, phone });
      
      toast({
        title: "Thank you!",
        description: "Your information has been saved. We'll be in touch soon!"
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error saving lead information:", error);
      toast({
        title: "An error occurred",
        description: "We couldn't save your information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Get Full Access</h2>
      <p className="text-gray-600 mb-6 text-center">
        You've used your 5 free questions! Enter your details to unlock unlimited questions and get a personalized demo.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="company">Company</Label>
          <Input 
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your company name"
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
            className="w-full"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-dreampath-purple hover:bg-dreampath-dark-purple"
          disabled={loading}
        >
          {loading ? "Saving..." : "Get Full Access"}
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          By submitting this form, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
};
