import React, { useState } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import RequestTabs from './RequestTabs';
import ResultFeedback from './ResultFeedback';
import { QueueItem, SystemLoad } from './RequestQueue';
import { HistoryItem } from './RequestHistory';
import { ProgressStage } from './DetailedProgress';

const AttributeMapping = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [mappingResults, setMappingResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Mock system load data
  const mockSystemLoad: SystemLoad = {
    level: 'medium',
    activeRequests: 12,
    averageWaitTime: 180,
    khdStatus: 'online',
    llmStatus: 'online'
  };

  const datamarts = [
    'dm.sales',
    'dm.clients', 
    'dm.products'
  ];

  const createProgressStages = (): ProgressStage[] => [
    {
      id: 'analysis',
      name: 'Анализ структуры данных',
      description: 'Изучение схемы исходных данных и целевой витрины',
      status: 'pending',
      progress: 0
    },
    {
      id: 'mapping',
      name: 'Построение маппинга',
      description: 'Сопоставление атрибутов источника и цели',
      status: 'pending',
      progress: 0
    },
    {
      id: 'validation',
      name: 'Валидация правил',
      description: 'Проверка корректности преобразований',
      status: 'pending',
      progress: 0
    },
    {
      id: 'generation',
      name: 'Генерация результата',
      description: 'Формирование финального маппинга',
      status: 'pending',
      progress: 0
    }
  ];

  const addToQueue = (title: string): string => {
    const id = Date.now().toString();
    const queueLength = queueItems.filter(item => item.status === 'pending').length;
    
    const newItem: QueueItem = {
      id,
      type: 'mapping',
      status: 'pending',
      title,
      progress: 0,
      startTime: new Date(),
      queuePosition: queueLength + 1,
      estimatedWaitTime: queueLength * 30, // 30 секунд на запрос
      stages: createProgressStages(),
      currentStage: 'analysis'
    };
    
    setQueueItems(prev => [...prev, newItem]);
    return id;
  };

  const updateQueueItem = (id: string, updates: Partial<QueueItem>) => {
    setQueueItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const updateStage = (requestId: string, stageId: string, updates: Partial<ProgressStage>) => {
    setQueueItems(prev => prev.map(item => {
      if (item.id === requestId && item.stages) {
        return {
          ...item,
          stages: item.stages.map(stage => 
            stage.id === stageId ? { ...stage, ...updates } : stage
          )
        };
      }
      return item;
    }));
  };

  const removeFromQueue = (id: string) => {
    const item = queueItems.find(q => q.id === id);
    if (item && (item.status === 'completed' || item.status === 'failed')) {
      // Перемещаем в историю
      const historyItem: HistoryItem = {
        id: item.id,
        type: item.type,
        title: item.title,
        status: item.status === 'completed' ? 'completed' : 'failed',
        startTime: item.startTime!,
        endTime: item.endTime!,
        error: item.error,
        result: item.status === 'completed' ? mappingResults : undefined
      };
      setHistoryItems(prev => [historyItem, ...prev]);
    }
    
    setQueueItems(prev => prev.filter(item => item.id !== id));
  };

  const simulateStageProgress = async (requestId: string) => {
    const stages = ['analysis', 'mapping', 'validation', 'generation'];
    
    for (let i = 0; i < stages.length; i++) {
      const stageId = stages[i];
      const isLastStage = i === stages.length - 1;
      
      // Устанавливаем текущий этап
      updateQueueItem(requestId, { currentStage: stageId });
      updateStage(requestId, stageId, { status: 'processing', progress: 0 });
      
      // Симулируем прогресс этапа
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        updateStage(requestId, stageId, { progress });
        
        // Обновляем общий прогресс
        const overallProgress = Math.floor((i * 100 + progress) / stages.length);
        updateQueueItem(requestId, { progress: overallProgress });
      }
      
      // Завершаем этап
      updateStage(requestId, stageId, { 
        status: 'completed', 
        progress: 100,
        duration: Math.floor(Math.random() * 5) + 2 
      });
      
      if (!isLastStage) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  };

  const handleBuildMapping = async () => {
    if (!selectedDatamart) return;
    
    const requestId = addToQueue(`Атрибутный маппинг для ${selectedDatamart}`);
    setIsLoading(true);
    setHasResults(false);
    
    // Обновляем статус на "выполняется"
    updateQueueItem(requestId, { status: 'processing', startTime: new Date() });
    
    try {
      // Симулируем прогресс по этапам
      await simulateStageProgress(requestId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResults = [
        {
          source: 'stg.sales.customer_id',
          target: 'dim_customer.customer_key',
          transformation: 'Direct mapping'
        },
        {
          source: 'stg.sales.product_id',
          target: 'dim_product.product_key', 
          transformation: 'Lookup transformation'
        },
        {
          source: 'stg.sales.amount',
          target: 'fact_sales.sales_amount',
          transformation: 'Data type conversion'
        }
      ];
      
      updateQueueItem(requestId, { 
        status: 'completed', 
        progress: 100, 
        endTime: new Date() 
      });
      
      setMappingResults(mockResults);
      setHasResults(true);
      
      // Удаляем из очереди через 3 секунды
      setTimeout(() => removeFromQueue(requestId), 3000);
      
    } catch (error) {
      updateQueueItem(requestId, { 
        status: 'failed', 
        error: 'Ошибка при построении маппинга',
        endTime: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryRequest = (id: string) => {
    const item = queueItems.find(q => q.id === id);
    if (item) {
      updateQueueItem(id, { 
        status: 'pending', 
        progress: 0, 
        error: undefined,
        stages: createProgressStages(),
        currentStage: 'analysis'
      });
    }
  };

  const handleCancelRequest = (id: string) => {
    removeFromQueue(id);
    if (isLoading) {
      setIsLoading(false);
    }
  };

  const handleFeedback = (rating: 'positive' | 'negative', comment?: string) => {
    console.log('Feedback received:', { rating, comment, feature: 'attribute-mapping' });
    
    // Обновляем последний элемент в истории с оценкой
    if (historyItems.length > 0) {
      const latestItem = historyItems[0];
      setHistoryItems(prev => prev.map(item => 
        item.id === latestItem.id 
          ? { ...item, rating, comment }
          : item
      ));
    }
  };

  const handleViewDetails = (id: string) => {
    console.log('View details for request:', id);
  };

  return (
    <div className="p-6 space-y-6">
      <RequestTabs 
        queueItems={queueItems}
        historyItems={historyItems}
        systemLoad={mockSystemLoad}
        onRetry={handleRetryRequest}
        onCancel={handleCancelRequest}
        onViewDetails={handleViewDetails}
      />

      {/* Control Panel */}
      <div className="dwh-card">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dwh-navy mb-2">
                Выберите витрину <span className="text-red-500">*</span>
              </label>
              <Select value={selectedDatamart} onValueChange={setSelectedDatamart}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите витрину" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  {datamarts.map((dm) => (
                    <SelectItem key={dm} value={dm} className="hover:bg-dwh-light">
                      {dm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleBuildMapping}
            disabled={!selectedDatamart || isLoading}
            className="dwh-button-primary"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {isLoading ? 'Построение...' : 'Построить атрибутный маппинг'}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {(hasResults || isLoading) && (
        <div className="dwh-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dwh-navy">
              Результаты маппинга ({mappingResults.length})
            </h3>
            {hasResults && !isLoading && (
              <Button className="dwh-button-secondary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dwh-navy"></div>
              <span className="ml-3 text-dwh-navy">Анализ структуры данных...</span>
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden mb-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-dwh-light">
                      <TableHead>Источник (STG)</TableHead>
                      <TableHead>Целевой атрибут</TableHead>
                      <TableHead>Тип преобразования</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappingResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{result.source}</TableCell>
                        <TableCell className="font-mono text-sm">{result.target}</TableCell>
                        <TableCell>{result.transformation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {hasResults && (
                <ResultFeedback onFeedback={handleFeedback} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AttributeMapping;
