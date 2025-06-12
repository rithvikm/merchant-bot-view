
export interface Message {
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

export interface ChartData {
  revenue: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
  transactions: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}
