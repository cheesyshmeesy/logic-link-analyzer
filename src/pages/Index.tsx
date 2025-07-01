
import React, { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import AttributeMapping from '@/components/AttributeMapping';
import ReverseEngineering from '@/components/ReverseEngineering';
import LogicalModel from '@/components/LogicalModel';
import RequestTabs from '@/components/RequestTabs';
import { QueueItem } from '@/components/RequestQueue';
import { HistoryItem } from '@/components/RequestHistory';

const Index = () => {
  const [activeTab, setActiveTab] = useState('mapping');
  const [showRequestTabs, setShowRequestTabs] = useState(false);

  // Мок данные для очереди запросов
  const mockQueueItems: QueueItem[] = [
    {
      id: '1',
      type: 'mapping',
      status: 'processing',
      title: 'Атрибутный маппинг для таблицы users',
      progress: 45,
      startTime: new Date(Date.now() - 120000),
      stages: [
        {
          id: 'analysis',
          name: 'Анализ структуры',
          description: 'Анализ исходной структуры данных',
          status: 'completed',
          progress: 100,
          duration: 15
        },
        {
          id: 'mapping',
          name: 'Построение маппинга',
          description: 'Создание связей между атрибутами',
          status: 'processing',
          progress: 45
        },
        {
          id: 'validation',
          name: 'Валидация результатов',
          description: 'Проверка корректности маппинга',
          status: 'pending',
          progress: 0
        }
      ],
      currentStage: 'mapping'
    },
    {
      id: '2',
      type: 'reverse',
      status: 'pending',
      title: 'Реверс-инжиниринг схемы orders',
      progress: 0,
      queuePosition: 2,
      estimatedWaitTime: 180
    }
  ];

  // Мок данные для истории запросов
  const mockHistoryItems: HistoryItem[] = [
    {
      id: 'h1',
      type: 'mapping',
      title: 'Атрибутный маппинг для таблицы customers',
      status: 'completed',
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() - 3300000),
      rating: 'positive',
      comment: 'Отличный результат'
    },
    {
      id: 'h2',
      type: 'reverse',
      title: 'Реверс-инжиниринг схемы products',
      status: 'failed',
      startTime: new Date(Date.now() - 7200000),
      endTime: new Date(Date.now() - 7100000),
      rating: 'negative',
      comment: 'Не учтены внешние ключи',
      error: 'Ошибка подключения к базе данных'
    },
    {
      id: 'h3',
      type: 'mapping',
      title: 'Атрибутный маппинг для таблицы transactions',
      status: 'completed',
      startTime: new Date(Date.now() - 86400000),
      endTime: new Date(Date.now() - 86100000),
      rating: 'positive'
    }
  ];

  const activeQueueItems = mockQueueItems.filter(item => 
    item.status === 'pending' || item.status === 'processing'
  );

  const handleRetry = (id: string) => {
    console.log('Повторить запрос:', id);
  };

  const handleCancel = (id: string) => {
    console.log('Отменить запрос:', id);
  };

  const handleViewDetails = (id: string) => {
    console.log('Просмотр деталей:', id);
  };

  const renderContent = () => {
    if (showRequestTabs) {
      return (
        <div className="p-6">
          <div className="mb-4">
            <button
              onClick={() => setShowRequestTabs(false)}
              className="text-dwh-navy hover:text-dwh-cyan text-sm font-medium"
            >
              ← Вернуться к функциям
            </button>
          </div>
          <RequestTabs
            queueItems={mockQueueItems}
            historyItems={mockHistoryItems}
            onRetry={handleRetry}
            onCancel={handleCancel}
            onViewDetails={handleViewDetails}
          />
        </div>
      );
    }

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
      <Header 
        onShowRequestTabs={() => setShowRequestTabs(true)}
        queueCount={activeQueueItems.length}
        historyCount={mockHistoryItems.length}
      />
      {!showRequestTabs && (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      <main className="max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
