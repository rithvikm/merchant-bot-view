
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardContent } from '@/components/DashboardContent';
import { AIAssistant } from '@/components/AIAssistant';
import { Chatbot } from '@/components/Chatbot';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'trading':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Trading</h2>
            <p className="text-gray-600">Advanced trading interface with real-time market data, order books, and trading tools.</p>
          </div>
        );
      case 'portfolio':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
            <p className="text-gray-600">View your cryptocurrency holdings, portfolio performance, and asset allocation.</p>
          </div>
        );
      case 'orders':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Orders</h2>
            <p className="text-gray-600">Manage your open orders, view order history, and track execution status.</p>
          </div>
        );
      case 'history':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Trade History</h2>
            <p className="text-gray-600">Complete history of your trades, transactions, and market activities.</p>
          </div>
        );
      case 'funding':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Funding</h2>
            <p className="text-gray-600">Deposit and withdraw cryptocurrencies and fiat currencies.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <p className="text-gray-600">Advanced trading analytics, market insights, and performance metrics.</p>
          </div>
        );
      case 'markets':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Markets</h2>
            <p className="text-gray-600">Real-time cryptocurrency market data, prices, and trading pairs.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Reports</h2>
            <p className="text-gray-600">Tax reports, trading summaries, and detailed account statements.</p>
          </div>
        );
      case 'security':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Security</h2>
            <p className="text-gray-600">Account security settings, 2FA configuration, and API key management.</p>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      
      <Chatbot />
    </div>
  );
};

export default Index;
