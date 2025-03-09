import { GoogleGenerativeAI, Part } from '@google/generative-ai';

// This will use the API key from environment variables
const getGeminiAPI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('GEMINI API key is missing. Please check your .env file.');
    return null;
  }
  
  return new GoogleGenerativeAI(apiKey);
};

export const generateChatResponse = async (prompt: string): Promise<string> => {
  try {
    const genAI = getGeminiAPI();
    
    if (!genAI) {
      return "I'm having trouble connecting to my brain right now. Please try again later.";
    }
    
    // Update to use the gemini-2.0-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Set up a chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ 
            text: "You are a helpful assistant for Seamless Edge Co., a drywall company based in Calgary, Alberta. You're here to answer questions about drywall services, provide quotes, and help schedule consultations. Keep your answers friendly, helpful and focused on drywall services."
          }],
        },
        {
          role: "model",
          parts: [{
            text: "I'll be happy to help as the virtual assistant for Seamless Edge Co. I'll focus on providing information about our drywall services in Calgary, helping with quote requests, and assisting with consultation scheduling. How can I assist you today?"
          }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 250,
      },
    });

    // Generate a response for the user's prompt
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
    
  } catch (error) {
    console.error('Error generating chat response:', error);
    return "I'm sorry, I encountered an error processing your request. Please try again later.";
  }
};

// Function to check if the API key is configured
export const isGeminiConfigured = (): boolean => {
  return !!import.meta.env.VITE_GEMINI_API_KEY;
}; 