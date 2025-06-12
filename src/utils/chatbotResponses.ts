
import { Message } from '@/types/chatbot';
import { generateChatResponse } from '@/services/openai';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const generateBotResponse = async (userMessage: string, conversationHistory: Message[] = []): Promise<Message> => {
  const botResponse: Message = {
    id: Date.now().toString(),
    type: 'bot',
    content: '',
    timestamp: new Date(),
  };

  // Convert message history to OpenAI format
  const chatHistory: ChatMessage[] = conversationHistory
    .slice(-10) // Keep last 10 messages for context
    .map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

  try {
    console.log('Generating response for:', userMessage);
    const response = await generateChatResponse(userMessage, chatHistory);
    botResponse.content = response;
  } catch (error) {
    console.error('Error generating bot response:', error);
    botResponse.content = "I apologize, but I'm having trouble generating a response right now. Please make sure your OpenAI API key is configured correctly.";
  }

  return botResponse;
};
