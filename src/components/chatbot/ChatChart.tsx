
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Message } from '@/types/chatbot';

interface ChatChartProps {
  message: Message;
}

export const ChatChart: React.FC<ChatChartProps> = ({ message }) => {
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
