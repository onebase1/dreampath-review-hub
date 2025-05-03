
import { ContentItem, ContentStats } from "../types/content";

// Mock content items for the dashboard
export const mockContentItems: ContentItem[] = [
  {
    id: "c1",
    type: "image",
    title: "Summer Beach Campaign",
    caption: "Escape to paradise! Our beach towels are ready for your next vacation. #SummerVibes #BeachLife",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
    dateCreated: "2025-05-01T10:30:00Z",
    status: "pending",
    urgency: "high",
  },
  {
    id: "c2",
    type: "carousel",
    title: "New Product Line",
    caption: "Introducing our eco-friendly collection - made with 100% recycled materials and designed for everyday use. Swipe to see all colors! #Sustainable #EcoFriendly",
    imageUrl: "https://images.unsplash.com/photo-1553531384-411a247ccd73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
    dateCreated: "2025-05-02T09:15:00Z",
    status: "pending",
    urgency: "normal",
  },
  {
    id: "c3",
    type: "video",
    title: "How-To Tutorial",
    caption: "Learn how to set up your new device in just 3 minutes with this simple step-by-step guide. #TechTips #HowTo",
    imageUrl: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    dateCreated: "2025-05-02T14:20:00Z",
    status: "pending",
    urgency: "normal",
  },
  {
    id: "c4",
    type: "text",
    title: "Motivational Quote",
    caption: "Monday motivation: 'The only way to do great work is to love what you do.' - Steve Jobs #MondayMotivation #Inspiration",
    imageUrl: "https://images.unsplash.com/photo-1552508744-1696d4464960?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    dateCreated: "2025-05-03T08:00:00Z",
    status: "pending",
    urgency: "normal",
  },
  {
    id: "c5",
    type: "image",
    title: "Holiday Special",
    caption: "Get ready for the holidays with our limited-time offer! 25% off all gift sets until December 1st. #HolidayShopping #SpecialOffer",
    imageUrl: "https://images.unsplash.com/photo-1512909006721-3d6018887383?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    dateCreated: "2025-05-03T11:45:00Z",
    status: "pending",
    urgency: "high",
  },
  {
    id: "c6",
    type: "carousel",
    title: "Customer Testimonials",
    caption: "Hear what our customers are saying about their experience with our products. Real reviews from real people. #CustomerLove #Testimonials",
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    dateCreated: "2025-05-04T13:10:00Z",
    status: "pending",
    urgency: "normal",
  },
];

// Mock stats for the dashboard
export const mockStats: ContentStats = {
  total: 120,
  approved: 78,
  rejected: 15,
  pending: 27,
};

// Mock service functions
export const fetchContentItems = async (): Promise<ContentItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockContentItems);
    }, 800); // Simulate network delay
  });
};

export const fetchContentStats = async (): Promise<ContentStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStats);
    }, 500); // Simulate network delay
  });
};

export const updateContentStatus = async (
  contentId: string,
  status: 'approved' | 'rejected'
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would update the backend
      console.log(`Content ${contentId} has been ${status}`);
      resolve(true);
    }, 300);
  });
};

export const submitFeedback = async (
  contentId: string,
  feedbackType: string,
  comments: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would send feedback to the backend
      console.log(`Feedback submitted for content ${contentId}:`, {
        type: feedbackType,
        comments,
      });
      resolve(true);
    }, 300);
  });
};
