
import { ContentItem } from "@/types/content";

// Airtable API constants
const AIRTABLE_API_KEY = "pate5bY8apa199fvx.a8672b97f4a5b27e34764abd801cf071f3b8b6462d8893be044fdc3e0e694ea3";
const AIRTABLE_BASE_ID = "appZhJda3P1E7nURe"; // Updated with correct base ID format
const AIRTABLE_API_URL = "https://api.airtable.com/v0";

/**
 * Fetches content items from Airtable
 */
export const fetchAirtableContent = async (): Promise<ContentItem[]> => {
  try {
    // Using console.log to help with debugging
    console.log("Fetching from Airtable...");
    
    const response = await fetch(
      `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/Content`, // Content table name
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Airtable API error response:", errorText);
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Airtable data received:", data);
    
    // Defensive check for empty or malformed data
    if (!data || !data.records || !Array.isArray(data.records)) {
      console.error("Airtable returned unexpected data structure:", data);
      return [];
    }
    
    // Map Airtable records to ContentItem format
    return data.records.map((record: any) => {
      const fields = record.fields || {};
      return {
        id: record.id,
        type: mapContentType(fields.ContentType) || "image",
        title: fields.Title || "Untitled Content",
        caption: fields.Caption || "",
        imageUrl: fields.ImageURL || fields.Image?.[0]?.url || "https://via.placeholder.com/600x400?text=Image+Not+Available",
        dateCreated: fields.DateCreated || new Date().toISOString(),
        status: "pending",
        urgency: fields.Urgency === "High" ? "high" : "normal"
      };
    });
  } catch (error) {
    console.error("Error fetching from Airtable:", error);
    throw error;
  }
};

/**
 * Maps Airtable content type values to our app's ContentType
 */
const mapContentType = (airtableType: string): "image" | "carousel" | "video" | "text" => {
  const typeMap: Record<string, "image" | "carousel" | "video" | "text"> = {
    "Image": "image",
    "Carousel": "carousel",
    "Video": "video",
    "Text": "text"
  };
  
  return typeMap[airtableType] || "image";
};

/**
 * Updates content status in Airtable
 */
export const updateAirtableContentStatus = async (
  contentId: string,
  status: 'approved' | 'rejected'
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/Content/${contentId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Status: status.charAt(0).toUpperCase() + status.slice(1)
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Airtable update error response:", errorText);
      throw new Error(`Airtable API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating Airtable content:", error);
    return false;
  }
};

/**
 * Submits feedback to Airtable
 */
export const submitAirtableFeedback = async (
  contentId: string,
  feedbackType: string,
  comments: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/Feedback`, // Feedback table
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            ContentID: contentId,
            FeedbackType: feedbackType,
            Comments: comments,
            Timestamp: new Date().toISOString()
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Airtable feedback submission error:", errorText);
      throw new Error(`Airtable API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error submitting feedback to Airtable:", error);
    return false;
  }
};

// Helper function to get image fields from Airtable
export const getImageFromAirtableField = (imageField: any): string => {
  if (!imageField) return "https://via.placeholder.com/600x400?text=Image+Not+Available";
  
  // Handle array of attachments (common Airtable format)
  if (Array.isArray(imageField) && imageField.length > 0) {
    return imageField[0].url;
  }
  
  // Handle string URL
  if (typeof imageField === 'string') {
    return imageField;
  }
  
  // Handle object with url property
  if (imageField?.url) {
    return imageField.url;
  }
  
  return "https://via.placeholder.com/600x400?text=Image+Not+Available";
};
