
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const openaiApiKey = Deno.env.get("OPENAI_API_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const configuration = new Configuration({ apiKey: openaiApiKey });
const openai = new OpenAIApi(configuration);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, website_url, session_id } = await req.json();
    console.log(`Received query: "${query}" for website: ${website_url}, session: ${session_id}`);
    
    if (!query || !website_url || !session_id) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user has used all their free questions
    const { data: sessionData, error: sessionError } = await supabase
      .from("user_sessions")
      .select("questions_asked, status")
      .eq("session_id", session_id)
      .single();

    if (sessionError) {
      console.error("Error fetching session:", sessionError);
      return new Response(
        JSON.stringify({ error: "Session not found" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user is over the limit
    if (sessionData.questions_asked >= 5 && sessionData.status === 'trial') {
      return new Response(
        JSON.stringify({ 
          error: "Free question limit reached", 
          questions_asked: sessionData.questions_asked,
          status: sessionData.status
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate embedding for query
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: query,
    });

    if (!embeddingResponse.data || !embeddingResponse.data.data || embeddingResponse.data.data.length === 0) {
      throw new Error("Failed to generate embedding");
    }

    const embedding = embeddingResponse.data.data[0].embedding;

    // Query Supabase for relevant content using vector search
    const { data: documents, error: searchError } = await supabase.rpc(
      "match_documents",
      {
        query_embedding: embedding,
        website_url: website_url,
        match_threshold: 0.75,
        match_count: 5
      }
    );

    if (searchError) {
      console.error("Error searching documents:", searchError);
      throw new Error("Failed to search for relevant content");
    }

    // If no relevant content found, return a message
    if (!documents || documents.length === 0) {
      return new Response(
        JSON.stringify({ answer: "I couldn't find information related to your question on this website." }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extract content from matched documents
    const relevantContent = documents.map(doc => doc.content).join("\n\n");
    const websiteInfo = documents[0].metadata?.website_title || website_url;

    // Generate answer using OpenAI
    const prompt = `
    You are a helpful assistant answering questions about the website "${websiteInfo}".

    Use ONLY the following information to answer the question:
    ${relevantContent}

    If the information is not in the text above, respond with "I don't have that information from this website."
    Always include the phrase "According to ${websiteInfo}" in your answer.

    Question: ${query}
    `;

    const completionResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.3,
    });

    const answer = completionResponse.data.choices[0]?.text?.trim() || 
                  "I'm sorry, I couldn't generate a response based on the website content.";

    // Update questions_asked count and last_active_at in database
    const { error: updateError } = await supabase
      .from("user_sessions")
      .update({ 
        questions_asked: sessionData.questions_asked + 1,
        last_active_at: new Date().toISOString()
      })
      .eq("session_id", session_id);

    if (updateError) {
      console.error("Error updating session:", updateError);
    }

    return new Response(
      JSON.stringify({
        answer,
        questions_asked: sessionData.questions_asked + 1,
        relevant_sources: documents.map(doc => ({
          content: doc.content.substring(0, 100) + "...",
          url: doc.metadata?.source_url || website_url
        }))
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error in generate-embedding function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
