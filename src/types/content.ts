
export type ContentType = 'image' | 'carousel' | 'video' | 'text';
export type FeedbackType = 'image_edit' | 'prompt_edit' | 'other';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  caption: string;
  imageUrl: string;
  dateCreated: string;
  status: ApprovalStatus;
  urgency: 'normal' | 'high';
}

export interface ContentStats {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}

export interface FeedbackData {
  contentId: string;
  feedbackType: FeedbackType;
  comments: string;
  timestamp: string;
}
