
import React, { useState } from 'react';
import { FileText, Download, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const ReverseEngineering = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleGenerate = async () => {
    if (!selectedDatamart || !selectedTemplate) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
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
      
      setGeneratedContent(content);
      setShowFeedback(true);
      setIsLoading(false);
    }, 3000);
  };

  const canGenerate = selectedDatamart && selectedTemplate;
  const hasContent = generatedContent.length > 0;

  return (
    <div className="p-6 space-y-6">
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
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
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
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
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

              {showFeedback && (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">Полезен ли этот ответ?</p>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800 hover:bg-green-50">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Полезно
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-50">
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      Неточно
                    </Button>
                  </div>
                </div>
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
