import React, { useState } from 'react';
import { Search, Download, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import RequestTabs from './RequestTabs';
import ResultFeedback from './ResultFeedback';
import { QueueItem } from './RequestQueue';
import { HistoryItem } from './RequestHistory';
import { ProgressStage } from './DetailedProgress';

const ReverseEngineering = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [requirements, setRequirements] = useState('');
  const [generatedRequirements, setGeneratedRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const datamarts = [
    'dm.sales',
    'dm.clients',
    'dm.products'
  ];

  const templates = [
    'ФТ - Функциональные требования',
    'БТ - Бизнес требования'
  ];

  const createProgressStages = (): ProgressStage[] => [
    {
      id: 'dataAnalysis',
      name: 'Анализ данных',
      description: 'Изучение структуры и содержания витрины данных',
      status: 'pending',
      progress: 0
    },
    {
      id: 'patternRecognition',
      name: 'Распознавание паттернов',
      description: 'Выявление бизнес-логики и правил обработки данных',
      status: 'pending',
      progress: 0
    },
    {
      id: 'requirementsExtraction',
      name: 'Извлечение требований',
      description: 'Формулирование требований на основе анализа',
      status: 'pending',
      progress: 0
    },
    {
      id: 'documentation',
      name: 'Документирование',
      description: 'Оформление требований по выбранному шаблону',
      status: 'pending',
      progress: 0
    }
  ];

  const addToQueue = (title: string): string => {
    const id = Date.now().toString();
    const queueLength = queueItems.filter(item => item.status === 'pending').length;
    
    const newItem: QueueItem = {
      id,
      type: 'reverse',
      status: 'pending',
      title,
      progress: 0,
      startTime: new Date(),
      queuePosition: queueLength + 1,
      estimatedWaitTime: queueLength * 45, // 45 секунд на запрос (дольше чем маппинг)
      stages: createProgressStages(),
      currentStage: 'dataAnalysis'
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
      const historyItem: HistoryItem = {
        id: item.id,
        type: item.type,
        title: item.title,
        status: item.status === 'completed' ? 'completed' : 'failed',
        startTime: item.startTime!,
        endTime: item.endTime!,
        error: item.error,
        result: item.status === 'completed' ? generatedRequirements : undefined
      };
      setHistoryItems(prev => [historyItem, ...prev]);
    }
    
    setQueueItems(prev => prev.filter(item => item.id !== id));
  };

  const simulateStageProgress = async (requestId: string) => {
    const stages = ['dataAnalysis', 'patternRecognition', 'requirementsExtraction', 'documentation'];
    
    for (let i = 0; i < stages.length; i++) {
      const stageId = stages[i];
      const isLastStage = i === stages.length - 1;
      
      updateQueueItem(requestId, { currentStage: stageId });
      updateStage(requestId, stageId, { status: 'processing', progress: 0 });
      
      // Разная скорость для разных этапов
      const stepDelay = stageId === 'requirementsExtraction' ? 300 : 200;
      
      for (let progress = 0; progress <= 100; progress += 25) {
        await new Promise(resolve => setTimeout(resolve, stepDelay));
        updateStage(requestId, stageId, { progress });
        
        const overallProgress = Math.floor((i * 100 + progress) / stages.length);
        updateQueueItem(requestId, { progress: overallProgress });
      }
      
      // Завершаем этап
      updateStage(requestId, stageId, { 
        status: 'completed', 
        progress: 100,
        duration: Math.floor(Math.random() * 8) + 3 
      });
      
      if (!isLastStage) {
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    }
  };

  const handleGenerateRequirements = async () => {
    if (!selectedDatamart || !selectedTemplate) return;

    const requestId = addToQueue(`Реверс-инжиниринг для ${selectedDatamart}`);
    setIsLoading(true);
    setHasResults(false);

    updateQueueItem(requestId, { status: 'processing', startTime: new Date() });

    try {
      await simulateStageProgress(requestId);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockRequirements = `# ${selectedTemplate}

## Витрина данных: ${selectedDatamart}

### 1. Описание витрины
Витрина ${selectedDatamart} содержит агрегированные данные по продажам, включая информацию о клиентах, продуктах и транзакциях.

### 2. Основные сущности
- **Клиенты**: Справочник клиентов с атрибутами
- **Продукты**: Каталог товаров и услуг  
- **Транзакции**: Факты продаж и операций

### 3. Бизнес-правила
- Расчет суммарных продаж по периодам
- Группировка по категориям клиентов
- Агрегация метрик производительности

### 4. Источники данных
- Система CRM для данных клиентов
- ERP система для продуктов
- Транзакционная система для операций`;

      updateQueueItem(requestId, { 
        status: 'completed', 
        progress: 100, 
        endTime: new Date() 
      });

      setGeneratedRequirements(mockRequirements);
      setHasResults(true);

      setTimeout(() => removeFromQueue(requestId), 3000);

    } catch (error) {
      updateQueueItem(requestId, { 
        status: 'failed', 
        error: 'Ошибка при генерации требований',
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
        currentStage: 'dataAnalysis'
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
    console.log('Feedback received:', { rating, comment, feature: 'reverse-engineering' });
    
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

  const handleClearRequirements = () => {
    setRequirements('');
    setGeneratedRequirements('');
    setHasResults(false);
  };

  return (
    <div className="p-6 space-y-6">
      <RequestTabs 
        queueItems={queueItems}
        historyItems={historyItems}
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

            <div>
              <label className="block text-sm font-medium text-dwh-navy mb-2">
                Шаблон требований <span className="text-red-500">*</span>
              </label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите шаблон" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  {templates.map((template) => (
                    <SelectItem key={template} value={template} className="hover:bg-dwh-light">
                      {template}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-dwh-navy">
                Дополнительные требования
              </label>
              {requirements && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearRequirements}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Очистить
                </Button>
              )}
            </div>
            <Textarea
              placeholder="Опишите специфические требования или ограничения..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={handleGenerateRequirements}
            disabled={!selectedDatamart || !selectedTemplate || isLoading}
            className="dwh-button-primary"
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? 'Генерация...' : 'Сгенерировать требования'}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {(hasResults || isLoading) && (
        <div className="dwh-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dwh-navy">
              Сформированные требования
            </h3>
            {hasResults && !isLoading && (
              <div className="flex space-x-2">
                <Button className="dwh-button-secondary" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Word
                </Button>
                <Button className="dwh-button-secondary" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dwh-navy"></div>
              <span className="ml-3 text-dwh-navy">Анализ данных...</span>
            </div>
          ) : hasResults ? (
            <>
              <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {generatedRequirements}
                </pre>
              </div>
              <ResultFeedback onFeedback={handleFeedback} />
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Нет сформированных требований</p>
              <p className="text-sm text-gray-400 mt-1">
                Выберите параметры и нажмите "Сгенерировать требования"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReverseEngineering;
