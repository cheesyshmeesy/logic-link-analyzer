
import React, { useState } from 'react';
import { Clock, History } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RequestQueue, { QueueItem } from './RequestQueue';
import RequestHistory, { HistoryItem } from './RequestHistory';

interface RequestTabsProps {
  queueItems: QueueItem[];
  historyItems: HistoryItem[];
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const RequestTabs: React.FC<RequestTabsProps> = ({
  queueItems,
  historyItems,
  onRetry,
  onCancel,
  onViewDetails
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
            {activeQueueItems.length > 0 && (
              <span className="bg-dwh-cyan text-white rounded-full px-2 py-0.5 text-xs ml-1">
                {activeQueueItems.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>История запросов</span>
            <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-xs ml-1">
              {historyItems.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-0">
          <RequestQueue 
            items={queueItems}
            onRetry={onRetry}
            onCancel={onCancel}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <RequestHistory 
            items={historyItems}
            onViewDetails={onViewDetails}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestTabs;
