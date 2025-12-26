import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationId, saveChat } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Generate response
    const result = await model.generateContent(message);
    const response = await result.response;
    const reply = response.text();

    // Here you would save to Supabase if saveChat is true
    // We'll implement that in next phase

    return res.status(200).json({ 
      reply: reply,
      conversationId: conversationId
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process message',
      details: error.message 
    });
  }
}

export const config = {
  runtime: 'edge',
};
