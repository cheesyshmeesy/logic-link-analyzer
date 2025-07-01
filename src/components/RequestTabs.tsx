
import React, { useState } from 'react';
import { Clock, History } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RequestQueue, { QueueItem, SystemLoad } from './RequestQueue';
import RequestHistory, { HistoryItem } from './RequestHistory';

interface RequestTabsProps {
  queueItems: QueueItem[];
  historyItems: HistoryItem[];
  systemLoad: SystemLoad;
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onRateRequest?: (id: string, rating: 'positive' | 'negative', comment?: string) => void;
}

const RequestTabs: React.FC<RequestTabsProps> = ({
  queueItems,
  historyItems,
  systemLoad,
  onRetry,
  onCancel,
  onViewDetails,
  onRateRequest
}) => {
  const [activeTab, setActiveTab] = useState('queue');
  const activeQueueItems = queueItems.filter(item => 
    item.status === 'pending' || item.status === 'processing'
  );

  return (
    <div className="dwh-card mb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="queue" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Очередь запросов</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>История запросов</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-0">
          <RequestQueue 
            items={queueItems}
            systemLoad={systemLoad}
            onRetry={onRetry}
            onCancel={onCancel}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <RequestHistory 
            items={historyItems}
            onViewDetails={onViewDetails}
            onRateRequest={onRateRequest}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestTabs;
