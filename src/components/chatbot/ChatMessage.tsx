
import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '@/types/chatbot';
import { ChatChart } from './ChatChart';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
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
            <ChatChart message={message} />
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
  );
};
