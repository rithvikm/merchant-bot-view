
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const generateChatResponse = async (userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> => {
  const apiKey = localStorage.getItem('openai_api_key');
  
  if (!apiKey) {
    return "I need an OpenAI API key to function. Please set your API key in the chat settings.";
  }

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are a helpful PayPal assistant chatbot. You help users with their PayPal business needs, including:
- Answering questions about transactions, revenue, and analytics
- Providing insights about business performance
- Helping with PayPal features and functionality
- General business support

When users ask about charts or data visualization, suggest they use the AI Assistant section for detailed analytics.
When users ask about images, you can describe what they might find useful but cannot generate images.

Keep responses concise, helpful, and professional. Focus on PayPal-related topics.`
    },
    ...conversationHistory.slice(-10), // Keep last 10 messages for context
    {
      role: 'user',
      content: userMessage
    }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "I'm having trouble connecting to my AI service right now. Please check your API key and try again.";
  }
};
