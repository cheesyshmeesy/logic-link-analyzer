
import React, { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import AttributeMapping from '@/components/AttributeMapping';
import ReverseEngineering from '@/components/ReverseEngineering';
import LogicalModel from '@/components/LogicalModel';

const Index = () => {
  const [activeTab, setActiveTab] = useState('mapping');

  const renderContent = () => {
    switch (activeTab) {
      case 'mapping':
        return <AttributeMapping />;
      case 'reverse':
        return <ReverseEngineering />;
      case 'model':
        return <LogicalModel />;
      default:
        return <AttributeMapping />;
    }
  };

  return (
    <div className="min-h-screen bg-dwh-light">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
