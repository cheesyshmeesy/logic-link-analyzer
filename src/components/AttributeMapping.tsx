
import React, { useState } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import RequestQueue, { QueueItem } from './RequestQueue';
import ResultFeedback from './ResultFeedback';

const AttributeMapping = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [mappingResults, setMappingResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);

  const datamarts = [
    'dm.sales',
    'dm.clients', 
    'dm.products'
  ];

  const addToQueue = (title: string): string => {
    const id = Date.now().toString();
    const newItem: QueueItem = {
      id,
      type: 'mapping',
      status: 'pending',
      title,
      progress: 0,
      startTime: new Date()
    };
    
    setQueueItems(prev => [...prev, newItem]);
    return id;
  };

  const updateQueueItem = (id: string, updates: Partial<QueueItem>) => {
    setQueueItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeFromQueue = (id: string) => {
    setQueueItems(prev => prev.filter(item => item.id !== id));
  };

  const handleBuildMapping = async () => {
    if (!selectedDatamart) return;
    
    const requestId = addToQueue(`Атрибутный маппинг для ${selectedDatamart}`);
    setIsLoading(true);
    setHasResults(false);
    
    // Обновляем статус на "выполняется"
    updateQueueItem(requestId, { status: 'processing', startTime: new Date() });
    
    // Симуляция прогресса
    const progressInterval = setInterval(() => {
      updateQueueItem(requestId, { 
        progress: Math.min(
          queueItems.find(item => item.id === requestId)?.progress + 25 || 25, 
          90
        )
      });
    }, 500);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
      
      clearInterval(progressInterval);
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
      clearInterval(progressInterval);
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
      updateQueueItem(id, { status: 'pending', progress: 0, error: undefined });
      // Здесь можно повторить запрос
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
    // Здесь можно отправить данные на сервер
  };

  return (
    <div className="p-6 space-y-6">
      <RequestQueue 
        items={queueItems}
        onRetry={handleRetryRequest}
        onCancel={handleCancelRequest}
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
