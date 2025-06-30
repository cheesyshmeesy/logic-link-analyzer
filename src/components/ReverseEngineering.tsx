
import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import RequestQueue, { QueueItem } from './RequestQueue';
import ResultFeedback from './ResultFeedback';

const ReverseEngineering = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);

  const datamarts = [
    'dm.sales',
    'dm.clients',
    'dm.products'
  ];

  const templates = [
    'ФТ',
    'БТ',
    'ОДС',
    'КХД'
  ];

  const addToQueue = (title: string): string => {
    const id = Date.now().toString();
    const newItem: QueueItem = {
      id,
      type: 'reverse',
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

  const handleGenerate = async () => {
    if (!selectedDatamart || !selectedTemplate) return;
    
    const requestId = addToQueue(`Реверс-инжиниринг ${selectedDatamart} (${selectedTemplate})`);
    setIsLoading(true);
    
    // Обновляем статус на "выполняется"
    updateQueueItem(requestId, { status: 'processing', startTime: new Date() });
    
    // Симуляция прогресса
    const progressInterval = setInterval(() => {
      updateQueueItem(requestId, { 
        progress: Math.min(
          queueItems.find(item => item.id === requestId)?.progress + 20 || 20, 
          90
        )
      });
    }, 600);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const content = `# Требования к витрине ${selectedDatamart}

## 1. Источники данных
- **Основной источник**: Stage-таблицы из OLTP системы
- **Дополнительные источники**: Справочники и мастер-данные
- **Частота обновления**: Ежедневно в 03:00

## 2. Бизнес-правила
### 2.1 Агрегация данных
- Группировка по клиентам, товарам и периодам
- Расчет показателей продаж и прибыльности
- Исключение тестовых и служебных записей

### 2.2 Качество данных
- Проверка корректности дат (не в будущем)
- Валидация сумм (больше 0)
- Контроль дублей по ключевым полям

## 3. Требования к производительности
- Время построения витрины: не более 2 часов
- Объем данных: до 10M записей в месяц
- SLA доступности: 99.5%

## 4. Структура данных
### 4.1 Основные измерения
- Клиенты (customer_key)
- Товары (product_key)  
- Время (date_key)
- География (location_key)

### 4.2 Факты
- Количество продаж (sales_qty)
- Сумма продаж (sales_amt)
- Себестоимость (cost_amt)
- Прибыль (profit_amt)`;
      
      clearInterval(progressInterval);
      updateQueueItem(requestId, { 
        status: 'completed', 
        progress: 100, 
        endTime: new Date() 
      });
      
      setGeneratedContent(content);
      
      // Удаляем из очереди через 3 секунды
      setTimeout(() => removeFromQueue(requestId), 3000);
      
    } catch (error) {
      clearInterval(progressInterval);
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
    console.log('Feedback received:', { rating, comment, feature: 'reverse-engineering' });
    // Здесь можно отправить данные на сервер
  };

  const canGenerate = selectedDatamart && selectedTemplate;
  const hasContent = generatedContent.length > 0;

  return (
    <div className="p-6 space-y-6">
      <RequestQueue 
        items={queueItems}
        onRetry={handleRetryRequest}
        onCancel={handleCancelRequest}
      />

      {/* Control Panel */}
      <div className="dwh-card">
        <h2 className="text-lg font-semibold text-dwh-navy mb-4">SQL → Бизнес-требования</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dwh-navy mb-2">
                Выберите витрину <span className="text-red-500">*</span>
              </label>
              <Select value={selectedDatamart} onValueChange={setSelectedDatamart}>
                <SelectTrigger>
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
                <SelectTrigger>
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

          <Button 
            onClick={handleGenerate}
            disabled={!canGenerate || isLoading}
            className="dwh-button-primary"
          >
            <FileText className="w-4 h-4 mr-2" />
            {isLoading ? 'Генерация...' : 'Сгенерировать требования'}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {(hasContent || isLoading) && (
        <div className="dwh-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dwh-navy">
              {isLoading ? 'Генерация требований...' : 'Сгенерированные требования'}
            </h3>
            {hasContent && !isLoading && (
              <div className="flex space-x-2">
                <Button className="dwh-button-secondary" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  DOCX
                </Button>
                <Button className="dwh-button-secondary" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Confluence
                </Button>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dwh-navy"></div>
              <span className="ml-3 text-dwh-navy">Анализ SQL-кода и генерация требований...</span>
            </div>
          ) : (
            <>
              <div className="bg-dwh-light p-4 rounded-lg mb-4">
                <Textarea 
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[400px] bg-white resize-none"
                  placeholder="Требования будут сгенерированы здесь..."
                />
              </div>

              {hasContent && (
                <ResultFeedback onFeedback={handleFeedback} />
              )}
            </>
          )}
        </div>
      )}

      {/* Empty State */}
      {!hasContent && !isLoading && (
        <div className="dwh-card">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Нет сформированных требований</p>
            <p className="text-sm text-gray-400 mt-2">
              Выберите витрину и шаблон, затем нажмите "Сгенерировать требования"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReverseEngineering;
