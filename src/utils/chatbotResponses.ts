
import { Message } from '@/types/chatbot';
import { sampleChartData, sampleImages } from './chatbotData';

export const generateBotResponse = (userMessage: string): Message => {
  const message = userMessage.toLowerCase();
  const botResponse: Message = {
    id: Date.now().toString(),
    type: 'bot',
    content: '',
    timestamp: new Date(),
  };

  if (message.includes('chart') || message.includes('graph') || message.includes('analytics')) {
    if (message.includes('revenue') || message.includes('sales')) {
      botResponse.content = 'Here\'s your revenue analytics chart showing monthly performance:';
      botResponse.hasChart = true;
      botResponse.chartType = 'bar';
      botResponse.chartData = sampleChartData.revenue;
    } else if (message.includes('transaction') || message.includes('pie')) {
      botResponse.content = 'Here\'s the breakdown of your transaction statuses:';
      botResponse.hasChart = true;
      botResponse.chartType = 'pie';
      botResponse.chartData = sampleChartData.transactions;
    } else {
      botResponse.content = 'Here\'s your revenue trend over the past 6 months:';
      botResponse.hasChart = true;
      botResponse.chartType = 'line';
      botResponse.chartData = sampleChartData.revenue;
    }
  } else if (message.includes('image') || message.includes('photo') || message.includes('picture')) {
    botResponse.content = 'Here\'s a relevant business image for you:';
    botResponse.hasImage = true;
    botResponse.imageUrl = sampleImages[Math.floor(Math.random() * sampleImages.length)];
  } else if (message.includes('help')) {
    botResponse.content = 'I can help you with:\n• Viewing charts and analytics\n• Displaying business images\n• Answering questions about your PayPal account\n• Processing transaction queries\n\nTry asking: "Show me a revenue chart" or "Display an image"';
  } else if (message.includes('revenue') || message.includes('earnings')) {
    botResponse.content = 'Your current revenue is $24,532.10 this month, which is up 12.5% from last month. Would you like to see a detailed chart?';
  } else if (message.includes('transaction')) {
    botResponse.content = 'You\'ve processed 1,247 transactions this month. 89% were successful, 8% are pending, and 3% failed. Would you like to see the breakdown in a pie chart?';
  } else {
    const responses = [
      'I\'m here to help with your PayPal business needs. Try asking about charts, images, or your account analytics!',
      'That\'s interesting! I can show you charts and images related to your business. What would you like to see?',
      'I\'d be happy to help! I can generate charts, display images, and provide insights about your PayPal account.',
    ];
    botResponse.content = responses[Math.floor(Math.random() * responses.length)];
  }

  return botResponse;
};
