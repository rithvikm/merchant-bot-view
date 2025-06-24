
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BitcoinIcon, 
  Wallet, 
  ArrowUpRight,
  MoreHorizontal,
  Activity
} from 'lucide-react';

const metrics = [
  {
    title: 'Portfolio Value',
    value: '$47,832.45',
    change: '+15.3%',
    trend: 'up',
    icon: Wallet,
    color: 'text-green-600'
  },
  {
    title: 'Total Trades',
    value: '2,847',
    change: '+12.8%',
    trend: 'up',
    icon: Activity,
    color: 'text-blue-600'
  },
  {
    title: 'Active Assets',
    value: '18',
    change: '+3',
    trend: 'up',
    icon: BitcoinIcon,
    color: 'text-orange-600'
  },
  {
    title: 'P&L (24h)',
    value: '+$1,247.80',
    change: '+3.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-purple-600'
  }
];

const recentTrades = [
  { id: '#KRK001', pair: 'BTC/USD', amount: '0.25 BTC', price: '$43,250.00', status: 'Filled', type: 'Buy' },
  { id: '#KRK002', pair: 'ETH/USD', amount: '2.5 ETH', price: '$2,850.75', status: 'Filled', type: 'Sell' },
  { id: '#KRK003', pair: 'ADA/USD', amount: '1000 ADA', price: '$0.65', status: 'Partial', type: 'Buy' },
  { id: '#KRK004', pair: 'SOL/USD', amount: '15 SOL', price: '$98.45', status: 'Cancelled', type: 'Sell' },
];

export const DashboardContent: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-50`}>
                      <Icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{metric.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Trades</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      trade.type === 'Buy' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <BitcoinIcon className={`w-5 h-5 ${
                        trade.type === 'Buy' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{trade.pair}</p>
                      <p className="text-sm text-gray-500">{trade.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{trade.price}</p>
                    <p className={`text-sm ${
                      trade.status === 'Filled' ? 'text-green-600' :
                      trade.status === 'Partial' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {trade.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Trades
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-600 hover:bg-purple-700">
                <TrendingUp className="w-6 h-6" />
                <span>Buy Crypto</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <TrendingDown className="w-6 h-6" />
                <span>Sell Crypto</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Wallet className="w-6 h-6" />
                <span>Deposit Funds</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Activity className="w-6 h-6" />
                <span>View Markets</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
