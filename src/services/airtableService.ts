
import { ContentItem } from "@/types/content";

// Airtable API constants
const AIRTABLE_API_KEY = "pate5bY8apa199fvx.a8672b97f4a5b27e34764abd801cf071f3b8b6462d8893be044fdc3e0e694ea3";
const AIRTABLE_BASE_ID = "appJPIE7nuRe"; // Social Media Poster base ID
const AIRTABLE_API_URL = "https://api.airtable.com/v0";
const AIRTABLE_TABLE_NAME = "tblzuATErls38jRfb"; // Try using the table ID instead of name

/**
 * Fetches content items from Airtable
 */
export const fetchAirtableContent = async (): Promise<ContentItem[]> => {
  try {
    // Using console.log to help with debugging
    console.log("Fetching from Airtable...");
    console.log(`Using base ID: ${AIRTABLE_BASE_ID} and table: ${AIRTABLE_TABLE_NAME}`);
    
    const response = await fetch(
      `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, 
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
    
    // Map Airtable records to ContentItem format - adapted for Social Media Poster base structure
    return data.records.map((record: any) => {
      const fields = record.fields || {};
      
      // Log the structure of the first record to help debugging
      if (record === data.records[0]) {
        console.log("First record structure:", fields);
      }
      
      // Try to extract the image URL from various possible field names
      const imageUrl = 
        fields.ImageURL || 
        fields.Image?.[0]?.url || 
        fields.Attachments?.[0]?.url || 
        fields["Image URL"] ||
        fields.image?.[0]?.url ||
        fields.attachments?.[0]?.url ||
        "https://via.placeholder.com/600x400?text=Image+Not+Available";

      return {
        id: record.id,
        type: mapContentType(fields.Type || fields.ContentType || fields.type || "image"),
        title: fields.Title || fields.Name || fields.name || fields.title || "Untitled Content",
        caption: fields.Caption || fields.Description || fields.description || fields.caption || "",
        imageUrl: imageUrl,
        dateCreated: fields.DateCreated || fields["Created Time"] || fields.created_time || fields.createdTime || new Date().toISOString(),
        status: fields.Status?.toLowerCase() || fields.status?.toLowerCase() || "pending",
        urgency: (fields.Urgency === "High" || fields.urgency === "High") ? "high" : "normal"
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
  // Normalize the type to lowercase for easier matching
  const normalizedType = airtableType.toLowerCase();
  
  if (normalizedType.includes("image")) return "image";
  if (normalizedType.includes("carousel")) return "carousel";
  if (normalizedType.includes("video")) return "video";
  if (normalizedType.includes("text")) return "text";
  
  return "image"; // Default fallback
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
      `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${contentId}`,
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
    // Try to submit to a "Feedback" table, if it exists
    try {
      const response = await fetch(
        `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/Feedback`,
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

      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.log("Feedback table not found, will try to update the content record instead");
    }
    
    // Fallback: If no Feedback table, update the main record with feedback
    const response = await fetch(
      `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}/${contentId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            FeedbackType: feedbackType,
            Feedback: comments,
            FeedbackTimestamp: new Date().toISOString()
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
