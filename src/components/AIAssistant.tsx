
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Bot, 
  User, 
  TrendingUp,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  hasChart?: boolean;
  chartType?: 'bar' | 'line' | 'pie';
  chartData?: any[];
}

const transactionInsights = {
  monthlyTrends: [
    { month: 'Jan', transactions: 240, revenue: 4000, avgAmount: 16.67 },
    { month: 'Feb', transactions: 139, revenue: 3000, avgAmount: 21.58 },
    { month: 'Mar', transactions: 180, revenue: 2000, avgAmount: 11.11 },
    { month: 'Apr', transactions: 221, revenue: 2780, avgAmount: 12.58 },
    { month: 'May', transactions: 250, revenue: 1890, avgAmount: 7.56 },
    { month: 'Jun', transactions: 210, revenue: 2390, avgAmount: 11.38 },
  ],
  statusBreakdown: [
    { name: 'Completed', value: 1180, color: '#10B981' },
    { name: 'Pending', value: 67, color: '#F59E0B' },
    { name: 'Failed', value: 40, color: '#EF4444' },
  ],
  topCategories: [
    { category: 'E-commerce', amount: 8500, transactions: 450 },
    { category: 'Services', amount: 6200, transactions: 320 },
    { category: 'Digital Products', amount: 4800, transactions: 280 },
    { category: 'Subscriptions', amount: 3200, transactions: 180 },
  ]
};

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your PayPal AI Assistant. I can help you analyze your transaction data, identify trends, and provide insights about your business performance. Try asking me about your revenue trends, transaction patterns, or any specific metrics you\'d like to understand better!',
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

  const generateInsightResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    const botResponse: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: '',
      timestamp: new Date(),
    };

    if (message.includes('revenue') || message.includes('sales') || message.includes('earning')) {
      botResponse.content = 'Here\'s your revenue trend analysis over the past 6 months. I can see that February had the highest average transaction value at $21.58, while May had the lowest at $7.56. Your total revenue for this period is $16,060.';
      botResponse.hasChart = true;
      botResponse.chartType = 'line';
      botResponse.chartData = transactionInsights.monthlyTrends;
    } else if (message.includes('transaction') && (message.includes('status') || message.includes('failed') || message.includes('success'))) {
      botResponse.content = 'Here\'s your transaction status breakdown. You have a 91.7% success rate with 1,180 completed transactions, 67 pending (5.2%), and only 40 failed transactions (3.1%). This is quite good performance!';
      botResponse.hasChart = true;
      botResponse.chartType = 'pie';
      botResponse.chartData = transactionInsights.statusBreakdown;
    } else if (message.includes('trend') || message.includes('pattern') || message.includes('monthly')) {
      botResponse.content = 'Your monthly transaction patterns show interesting trends. May had the highest volume with 250 transactions, but April and June show more consistent performance. The average transaction value varies significantly month to month.';
      botResponse.hasChart = true;
      botResponse.chartType = 'bar';
      botResponse.chartData = transactionInsights.monthlyTrends;
    } else if (message.includes('category') || message.includes('top') || message.includes('best')) {
      botResponse.content = 'Based on your transaction categories, E-commerce is your top performer with $8,500 in revenue from 450 transactions. Services and Digital Products are also strong segments. Here\'s the breakdown:';
      botResponse.hasChart = true;
      botResponse.chartType = 'bar';
      botResponse.chartData = transactionInsights.topCategories.map(cat => ({
        name: cat.category,
        revenue: cat.amount,
        transactions: cat.transactions
      }));
    } else if (message.includes('improve') || message.includes('recommendation') || message.includes('advice')) {
      botResponse.content = 'Based on your data analysis, here are my recommendations:\n\n• Focus on replicating February\'s success - higher average transaction values\n• Investigate May\'s performance drop and address underlying issues\n• Your 3.1% failure rate is good, but could be improved with better payment processing\n• E-commerce category is thriving - consider expanding this segment\n• Consider promoting higher-value services to increase average transaction amounts';
    } else if (message.includes('compare') || message.includes('vs') || message.includes('difference')) {
      botResponse.content = 'Let me compare your best and worst performing months:\n\n📈 **February (Best)**: 139 transactions, $3,000 revenue, $21.58 avg\n📉 **May (Challenging)**: 250 transactions, $1,890 revenue, $7.56 avg\n\nMay had 80% more transactions but 37% less revenue, indicating a shift toward lower-value transactions. This suggests a change in customer behavior or product mix.';
    } else {
      const responses = [
        'I can help you analyze various aspects of your transaction data. Try asking about revenue trends, transaction patterns, success rates, or recommendations for improvement.',
        'What specific insights would you like about your transactions? I can show you charts for revenue, transaction volumes, success rates, or category breakdowns.',
        'I have access to your transaction analytics. Ask me about monthly trends, performance comparisons, or any specific metrics you\'d like to understand better.',
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

    // Simulate AI processing time
    setTimeout(() => {
      const botResponse = generateInsightResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const renderChart = (message: Message) => {
    if (!message.hasChart || !message.chartData) return null;

    const containerStyle = { width: '100%', height: 300 };

    switch (message.chartType) {
      case 'bar':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <ResponsiveContainer {...containerStyle}>
              <BarChart data={message.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={message.chartData[0]?.month ? "month" : message.chartData[0]?.name ? "name" : "category"} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={message.chartData[0]?.revenue ? "revenue" : message.chartData[0]?.transactions ? "transactions" : "value"} fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'line':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <ResponsiveContainer {...containerStyle}>
              <LineChart data={message.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="transactions" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'pie':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <ResponsiveContainer {...containerStyle}>
              <PieChart>
                <Pie
                  data={message.chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
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

  const quickQuestions = [
    "Show me my revenue trends",
    "What's my transaction success rate?",
    "Compare my best and worst months",
    "Give me improvement recommendations"
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Assistant</h2>
        <p className="text-gray-600">Get intelligent insights about your transaction data and business performance.</p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>Transaction Insights AI</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl p-4 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {message.type === 'bot' && (
                      <div className="flex-shrink-0">
                        <Bot className="w-5 h-5 mt-1" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-line">{message.content}</p>
                      {message.hasChart && renderChart(message)}
                    </div>
                    {message.type === 'user' && (
                      <div className="flex-shrink-0">
                        <User className="w-5 h-5 mt-1" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputValue(question);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask me about your transaction insights, revenue trends, or business performance..."
                className="flex-1 min-h-[60px] resize-none"
                rows={2}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputValue.trim()}
                className="self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
