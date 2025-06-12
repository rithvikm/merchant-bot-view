
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
      case 'transactions':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Transactions</h2>
            <p className="text-gray-600">Transaction management interface would go here.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <p className="text-gray-600">Detailed analytics and reporting interface would go here.</p>
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
