import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Bot, 
  User,
  Loader2,
  MessageSquare,
  Trash2,
  Plus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { generateChatResponse } from '@/services/openai';
import { ApiKeyDialog } from './chatbot/ApiKeyDialog';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  hasChart?: boolean;
  chartType?: 'bar' | 'line' | 'pie';
  chartData?: any[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
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
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('ai_chat_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        lastUpdated: new Date(session.lastUpdated),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    }
    return [];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = chatSessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ai_chat_sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        id: '1',
        type: 'bot',
        content: 'Hello! I\'m your Transaction Insights AI Assistant. I can analyze your transaction data, create charts, and provide insights about your business performance. Ask me about revenue trends, transaction patterns, or any specific metrics you\'d like to understand better!',
        timestamp: new Date(),
      }],
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remaining = chatSessions.filter(s => s.id !== sessionId);
      setCurrentSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const updateSessionTitle = (sessionId: string, firstUserMessage: string) => {
    const title = firstUserMessage.length > 30 
      ? firstUserMessage.substring(0, 30) + '...' 
      : firstUserMessage;
    
    setChatSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, title }
        : session
    ));
  };

  const generateContextualSuggestions = (conversationHistory: Message[]): string[] => {
    const recentMessages = conversationHistory.slice(-6);
    const userMessages = recentMessages.filter(m => m.type === 'user');
    const botMessages = recentMessages.filter(m => m.type === 'bot');
    
    // Base suggestions
    const baseSuggestions = [
      "Show me my revenue trends",
      "What's my transaction success rate?", 
      "Compare my best and worst months",
      "Give me improvement recommendations"
    ];

    // If no conversation yet, return base suggestions
    if (userMessages.length === 0) {
      return baseSuggestions;
    }

    // Generate contextual suggestions based on conversation
    const contextualSuggestions: string[] = [];
    
    // Check if user asked about revenue/trends
    if (userMessages.some(m => m.content.toLowerCase().includes('revenue') || m.content.toLowerCase().includes('trend'))) {
      contextualSuggestions.push("Break down revenue by category");
      contextualSuggestions.push("Show seasonal patterns");
    }
    
    // Check if user asked about failures/problems
    if (userMessages.some(m => m.content.toLowerCase().includes('fail') || m.content.toLowerCase().includes('problem'))) {
      contextualSuggestions.push("How can I reduce failed transactions?");
      contextualSuggestions.push("What causes transaction failures?");
    }
    
    // Check if user asked about categories
    if (userMessages.some(m => m.content.toLowerCase().includes('category') || m.content.toLowerCase().includes('segment'))) {
      contextualSuggestions.push("Which category has highest growth?");
      contextualSuggestions.push("Compare category performance");
    }
    
    // Check if charts were shown
    if (botMessages.some(m => m.hasChart)) {
      contextualSuggestions.push("Explain what this data means for my business");
      contextualSuggestions.push("What actions should I take based on this?");
    }
    
    // Fill remaining slots with base suggestions
    const remaining = 4 - contextualSuggestions.length;
    const unusedBase = baseSuggestions.filter(base => 
      !contextualSuggestions.some(ctx => 
        ctx.toLowerCase().includes(base.toLowerCase().split(' ')[2]) || 
        base.toLowerCase().includes(ctx.toLowerCase().split(' ')[2])
      )
    );
    
    return [...contextualSuggestions, ...unusedBase.slice(0, remaining)];
  };

  const determineChartFromMessage = (message: string, content: string) => {
    const lowerMessage = message.toLowerCase();
    const lowerContent = content.toLowerCase();
    
    if ((lowerMessage.includes('revenue') || lowerMessage.includes('sales') || lowerMessage.includes('earning')) && 
        (lowerContent.includes('trend') || lowerContent.includes('over time'))) {
      return {
        hasChart: true,
        chartType: 'line' as const,
        chartData: transactionInsights.monthlyTrends
      };
    } else if ((lowerMessage.includes('status') || lowerMessage.includes('failed') || lowerMessage.includes('success')) ||
               (lowerContent.includes('breakdown') || lowerContent.includes('distribution'))) {
      return {
        hasChart: true,
        chartType: 'pie' as const,
        chartData: transactionInsights.statusBreakdown
      };
    } else if ((lowerMessage.includes('category') || lowerMessage.includes('top') || lowerMessage.includes('best')) ||
               (lowerContent.includes('categor') || lowerContent.includes('segment'))) {
      return {
        hasChart: true,
        chartType: 'bar' as const,
        chartData: transactionInsights.topCategories.map(cat => ({
          name: cat.category,
          revenue: cat.amount,
          transactions: cat.transactions
        }))
      };
    } else if (lowerMessage.includes('trend') || lowerMessage.includes('pattern') || lowerMessage.includes('monthly')) {
      return {
        hasChart: true,
        chartType: 'bar' as const,
        chartData: transactionInsights.monthlyTrends
      };
    }
    
    return { hasChart: false };
  };

  const generateInsightResponse = async (userMessage: string, conversationHistory: Message[] = []): Promise<Message> => {
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

    const systemPrompt = `You are a Transaction Insights AI Assistant for a PayPal business dashboard. You help users analyze their transaction data and provide business insights.

Available transaction data:
- Monthly trends: Jan (240 transactions, $4000 revenue), Feb (139 transactions, $3000 revenue), Mar (180 transactions, $2000 revenue), Apr (221 transactions, $2780 revenue), May (250 transactions, $1890 revenue), Jun (210 transactions, $2390 revenue)
- Transaction status: 1180 completed (91.7%), 67 pending (5.2%), 40 failed (3.1%)
- Top categories: E-commerce ($8500, 450 transactions), Services ($6200, 320 transactions), Digital Products ($4800, 280 transactions), Subscriptions ($3200, 180 transactions)

Consider the conversation history when providing responses. Build on previous topics discussed and provide deeper insights based on the context of the conversation.

When users ask about charts, data visualization, trends, or specific metrics, provide detailed insights based on this data. 
When discussing revenue trends, mention that you'll show a line chart.
When discussing transaction status or breakdowns, mention that you'll show a pie chart.
When discussing categories or comparisons, mention that you'll show a bar chart.

Keep responses professional, insightful, and focused on actionable business intelligence.`;

    try {
      console.log('Generating AI response for transaction insights:', userMessage);
      const response = await generateChatResponse(userMessage, [
        { role: 'system', content: systemPrompt },
        ...chatHistory
      ]);
      botResponse.content = response;

      // Determine if we should show a chart based on the user message and AI response
      const chartInfo = determineChartFromMessage(userMessage, response);
      botResponse.hasChart = chartInfo.hasChart;
      botResponse.chartType = chartInfo.chartType;
      botResponse.chartData = chartInfo.chartData;

    } catch (error) {
      console.error('Error generating AI response:', error);
      botResponse.content = "I apologize, but I'm having trouble generating insights right now. Please make sure your OpenAI API key is configured correctly in the settings.";
    }

    return botResponse;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Create new session if none exists
    if (!currentSessionId) {
      createNewSession();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    // Update current session with new message
    setChatSessions(prev => prev.map(session => 
      session.id === currentSessionId 
        ? { 
            ...session, 
            messages: [...session.messages, userMessage],
            lastUpdated: new Date()
          }
        : session
    ));

    // Update session title if this is the first user message
    const currentMessages = currentSession?.messages || [];
    const isFirstUserMessage = !currentMessages.some(m => m.type === 'user');
    if (isFirstUserMessage) {
      updateSessionTitle(currentSessionId, inputValue);
    }

    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const botResponse = await generateInsightResponse(currentInput, currentMessages);
      
      // Add bot response to session
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, userMessage, botResponse],
              lastUpdated: new Date()
            }
          : session
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error generating insights. Please try again.',
        timestamp: new Date(),
      };
      
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, userMessage, errorMessage],
              lastUpdated: new Date()
            }
          : session
      ));
    } finally {
      setIsLoading(false);
    }
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

  const quickQuestions = generateContextualSuggestions(messages);

  // Start new chat if no sessions exist
  useEffect(() => {
    if (chatSessions.length === 0) {
      createNewSession();
    } else if (!currentSessionId && chatSessions.length > 0) {
      setCurrentSessionId(chatSessions[0].id);
    }
  }, [chatSessions.length, currentSessionId]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Assistant</h2>
        <p className="text-gray-600">Get intelligent insights about your transaction data and business performance.</p>
      </div>

      <div className="flex gap-6 h-[600px]">
        {/* Chat History Sidebar */}
        <div className="w-80 bg-gray-50 rounded-lg p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Chat History</h3>
            <Button
              onClick={createNewSession}
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-md cursor-pointer transition-colors group ${
                  currentSessionId === session.id 
                    ? 'bg-blue-100 border border-blue-200' 
                    : 'bg-white hover:bg-gray-100'
                }`}
                onClick={() => setCurrentSessionId(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {session.title}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {session.lastUpdated.toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Interface */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Transaction Insights AI</span>
              </div>
              <ApiKeyDialog />
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
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3xl p-4 rounded-lg bg-gray-100 text-gray-900">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Bot className="w-5 h-5 mt-1" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Analyzing your data...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                    disabled={isLoading}
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
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputValue.trim() || isLoading}
                  className="self-end"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <div className="text-xs text-gray-500 text-center">
                {!localStorage.getItem('openai_api_key') && 'Configure your OpenAI API key in settings to get started'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
