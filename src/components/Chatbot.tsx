
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  BarChart3,
  Image as ImageIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  hasChart?: boolean;
  chartType?: 'bar' | 'line' | 'pie';
  chartData?: any[];
  hasImage?: boolean;
  imageUrl?: string;
}

const sampleChartData = {
  revenue: [
    { month: 'Jan', revenue: 4000, transactions: 240 },
    { month: 'Feb', revenue: 3000, transactions: 139 },
    { month: 'Mar', revenue: 2000, transactions: 180 },
    { month: 'Apr', revenue: 2780, transactions: 221 },
    { month: 'May', revenue: 1890, transactions: 250 },
    { month: 'Jun', revenue: 2390, transactions: 210 },
  ],
  transactions: [
    { name: 'Completed', value: 400, color: '#10B981' },
    { name: 'Pending', value: 300, color: '#F59E0B' },
    { name: 'Failed', value: 100, color: '#EF4444' },
  ]
};

const sampleImages = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
];

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your PayPal assistant. I can help you with analytics, show charts, and display images. Try asking me about your revenue, transactions, or request a chart!',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const renderChart = (message: Message) => {
    if (!message.hasChart || !message.chartData) return null;

    const containerStyle = { width: '100%', height: 200 };

    switch (message.chartType) {
      case 'bar':
        return (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <ResponsiveContainer {...containerStyle}>
              <BarChart data={message.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'line':
        return (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <ResponsiveContainer {...containerStyle}>
              <LineChart data={message.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'pie':
        return (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <ResponsiveContainer {...containerStyle}>
              <PieChart>
                <Pie
                  data={message.chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {message.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 shadow-xl transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <CardTitle className="text-sm">PayPal Assistant</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-blue-700 p-1"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-blue-700 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-full p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      {message.hasChart && renderChart(message)}
                      {message.hasImage && message.imageUrl && (
                        <div className="mt-3">
                          <img
                            src={message.imageUrl}
                            alt="Business related"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    {message.type === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about charts, images, or analytics..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setInputValue('Show me a revenue chart');
                  handleSendMessage();
                }}
                className="text-xs"
              >
                <BarChart3 className="w-3 h-3 mr-1" />
                Chart
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setInputValue('Show me an image');
                  handleSendMessage();
                }}
                className="text-xs"
              >
                <ImageIcon className="w-3 h-3 mr-1" />
                Image
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
