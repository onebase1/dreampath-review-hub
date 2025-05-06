
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Types
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatSession {
  sessionId: string;
  websiteUrl: string;
  questionsAsked: number;
  status: 'trial' | 'lead' | 'customer';
  messages: ChatMessage[];
}

// Constants
const MAX_FREE_QUESTIONS = 5;
const SESSION_STORAGE_KEY = 'chatbot_session';

// Create a new session
export const createChatSession = async (websiteUrl: string): Promise<ChatSession> => {
  try {
    // Create a session in Supabase
    const { data, error } = await supabase
      .from('user_sessions')
      .insert([{
        website_url: websiteUrl,
        status: 'trial',
        questions_asked: 0
      }])
      .select('session_id')
      .single();

    if (error) {
      console.error('Error creating session:', error);
      throw error;
    }

    const sessionId = data.session_id;

    // Create local session object
    const session: ChatSession = {
      sessionId,
      websiteUrl,
      questionsAsked: 0,
      status: 'trial',
      messages: [{
        id: uuidv4(),
        content: `Hello! I'm your AI assistant for ${websiteUrl}. How can I help you today?`,
        isUser: false,
        timestamp: new Date()
      }]
    };

    // Save to localStorage
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

    return session;
  } catch (error) {
    console.error('Error in createChatSession:', error);
    throw error;
  }
};

// Get the current session from localStorage
export const getCurrentSession = (): ChatSession | null => {
  const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionData) return null;
  
  try {
    const session = JSON.parse(sessionData);
    return session;
  } catch (e) {
    console.error('Error parsing session data:', e);
    return null;
  }
};

// Update the current session
export const updateSessionInStorage = (session: ChatSession): void => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

// Send a question to the chatbot
export const askQuestion = async (question: string, session: ChatSession): Promise<{
  answer: string;
  questionsRemaining: number;
  error?: string;
}> => {
  try {
    // Add user message to session
    const updatedSession = {
      ...session,
      messages: [
        ...session.messages,
        {
          id: uuidv4(),
          content: question,
          isUser: true,
          timestamp: new Date()
        }
      ]
    };
    
    updateSessionInStorage(updatedSession);

    // Send request to edge function
    const response = await fetch(`https://lmifuqesostqcfyshtdl.supabase.co/functions/v1/generate-embedding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: question,
        website_url: session.websiteUrl,
        session_id: session.sessionId
      })
    });

    const data = await response.json();
    
    if (data.error) {
      // Update session with error message
      const errorSession: ChatSession = {
        ...updatedSession,
        messages: [
          ...updatedSession.messages,
          {
            id: uuidv4(),
            content: data.error === "Free question limit reached" 
              ? "You've reached your limit of 5 free questions. Please provide your contact information to continue."
              : "Sorry, I encountered an error while processing your question.",
            isUser: false,
            timestamp: new Date()
          }
        ],
        questionsAsked: data.questions_asked || session.questionsAsked,
        status: (data.status as 'trial' | 'lead' | 'customer') || session.status
      };
      
      updateSessionInStorage(errorSession);
      
      return {
        answer: data.error,
        questionsRemaining: MAX_FREE_QUESTIONS - errorSession.questionsAsked,
        error: data.error
      };
    }

    // Update session with bot response
    const finalSession: ChatSession = {
      ...updatedSession,
      messages: [
        ...updatedSession.messages,
        {
          id: uuidv4(),
          content: data.answer,
          isUser: false,
          timestamp: new Date()
        }
      ],
      questionsAsked: data.questions_asked || session.questionsAsked + 1
    };
    
    updateSessionInStorage(finalSession);
    
    return {
      answer: data.answer,
      questionsRemaining: MAX_FREE_QUESTIONS - finalSession.questionsAsked
    };
  } catch (error) {
    console.error('Error in askQuestion:', error);
    
    // Update session with error message
    const errorSession: ChatSession = {
      ...session,
      messages: [
        ...session.messages,
        {
          id: uuidv4(),
          content: question,
          isUser: true,
          timestamp: new Date()
        },
        {
          id: uuidv4(),
          content: "Sorry, I encountered an error while processing your question.",
          isUser: false,
          timestamp: new Date()
        }
      ]
    };
    
    updateSessionInStorage(errorSession);
    
    throw error;
  }
};

// Update user information after lead capture
export const updateUserInfo = async (
  sessionId: string,
  userInfo: { name: string; email: string; company?: string; phone?: string }
): Promise<void> => {
  try {
    // Update user info in Supabase
    const { error } = await supabase
      .from('user_sessions')
      .update({
        user_name: userInfo.name,
        user_email: userInfo.email,
        status: 'lead'
      })
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error updating user info:', error);
      throw error;
    }

    // Update local session
    const currentSession = getCurrentSession();
    if (currentSession) {
      const updatedSession: ChatSession = {
        ...currentSession,
        status: 'lead'
      };
      updateSessionInStorage(updatedSession);
    }
  } catch (error) {
    console.error('Error in updateUserInfo:', error);
    throw error;
  }
};
