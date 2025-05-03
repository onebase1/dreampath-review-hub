
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Check, X } from "lucide-react";
import { ContentItem } from "@/types/content";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { updateContentStatus, submitFeedback } from "@/services/mockData";

interface ContentCardProps {
  item: ContentItem;
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void;
}

const ContentCard = ({ item, onStatusUpdate }: ContentCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<string>("prompt_edit");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const dateFormatted = format(new Date(item.dateCreated), "MMM dd, yyyy h:mm a");

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await updateContentStatus(item.id, "approved");
      onStatusUpdate(item.id, "approved");
      toast({
        title: "Content approved",
        description: "Content has been approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve content",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = () => {
    setIsDialogOpen(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackType) {
      toast({
        title: "Error",
        description: "Please select a feedback type",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback(item.id, feedbackType, comments);
      await updateContentStatus(item.id, "rejected");
      onStatusUpdate(item.id, "rejected");
      setIsDialogOpen(false);
      toast({
        title: "Feedback submitted",
        description: "Content has been rejected with feedback",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="content-card animate-fade-in">
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="content-card-image"
            />
            <Badge 
              className={`absolute top-2 right-2 ${
                item.urgency === 'high' ? 'bg-dreampath-red' : 'bg-gray-500'
              }`}
            >
              {item.urgency === 'high' ? 'Urgent' : 'Normal'}
            </Badge>
            <Badge 
              className="absolute top-2 left-2 bg-dreampath-purple"
            >
              {item.type}
            </Badge>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
            <p className="text-gray-700 text-sm mb-3">{item.caption}</p>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{dateFormatted}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between gap-2">
          <Button 
            onClick={handleReject} 
            className="flex-1 button-reject"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-1" /> Reject
          </Button>
          <Button 
            onClick={handleApprove} 
            className="flex-1 button-approve"
            disabled={isSubmitting}
          >
            <Check className="h-4 w-4 mr-1" /> Approve
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejection Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <p className="text-sm font-medium mb-2">Select feedback type:</p>
              <RadioGroup 
                value={feedbackType} 
                onValueChange={setFeedbackType} 
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prompt_edit" id="prompt_edit" />
                  <Label htmlFor="prompt_edit">Prompt Edit Required</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image_edit" id="image_edit" />
                  <Label htmlFor="image_edit">Image Edit Required</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other Issue</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="comments">Additional comments:</Label>
              <Textarea
                id="comments"
                placeholder="Please provide specific feedback about what needs to be improved..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              className="button-primary"
              onClick={handleFeedbackSubmit}
              disabled={isSubmitting}
            >
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentCard;
