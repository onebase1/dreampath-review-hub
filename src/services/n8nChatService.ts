
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, ChatSession } from "@/services/chatbotService";
import { v4 as uuidv4 } from "uuid";

// Constants
const N8N_CHAT_WEBHOOK_URL = "https://n8n-fpyfr-u38498.vm.elestio.app/webhook/chat";

// Types
interface N8nChatRequest {
  query: string;
  sessionId: string;
  websiteUrl: string;
}

interface N8nChatResponse {
  answer: string;
  error?: string;
}

/**
 * Sends a chat message to the n8n workflow and processes the response
 */
export const sendChatMessageToN8n = async (
  message: string,
  session: ChatSession
): Promise<{
  answer: string;
  error?: string;
}> => {
  try {
    // Prepare the request payload for n8n
    const payload: N8nChatRequest = {
      query: message,
      sessionId: session.sessionId,
      websiteUrl: session.websiteUrl,
    };

    console.log("Sending message to n8n:", payload);

    // Send the request to n8n webhook
    const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error from n8n: ${response.status} ${response.statusText}`);
    }

    const data: N8nChatResponse = await response.json();
    
    if (data.error) {
      console.error("Error from n8n workflow:", data.error);
      return {
        answer: "Sorry, I encountered an error processing your question.",
        error: data.error
      };
    }

    return {
      answer: data.answer || "I couldn't generate a response. Please try again."
    };
  } catch (error) {
    console.error("Error in sendChatMessageToN8n:", error);
    return {
      answer: "Sorry, there was an error connecting to the chat service.",
      error: error.message
    };
  }
};

/**
 * Updates the chat session with user question and n8n response
 */
export const updateChatSessionWithN8nResponse = (
  session: ChatSession, 
  userQuestion: string, 
  aiResponse: string
): ChatSession => {
  // Create new messages
  const userMessage: ChatMessage = {
    id: uuidv4(),
    content: userQuestion,
    isUser: true,
    timestamp: new Date()
  };
  
  const botMessage: ChatMessage = {
    id: uuidv4(),
    content: aiResponse,
    isUser: false,
    timestamp: new Date()
  };
  
  // Update the session
  const updatedSession: ChatSession = {
    ...session,
    messages: [...session.messages, userMessage, botMessage],
    questionsAsked: session.questionsAsked + 1
  };
  
  return updatedSession;
};
