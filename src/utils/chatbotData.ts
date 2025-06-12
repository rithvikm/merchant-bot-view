
import { ChartData } from '@/types/chatbot';

export const sampleChartData: ChartData = {
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

export const sampleImages = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
];
