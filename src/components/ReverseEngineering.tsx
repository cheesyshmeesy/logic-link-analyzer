
import React, { useState } from 'react';
import { Search, Download, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import ResultFeedback from './ResultFeedback';

const ReverseEngineering = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [requirements, setRequirements] = useState('');
  const [generatedRequirements, setGeneratedRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const datamarts = [
    'dm.sales',
    'dm.clients',
    'dm.products'
  ];

  const templates = [
    'ФТ - Функциональные требования',
    'БТ - Бизнес требования'
  ];

  const handleGenerateRequirements = async () => {
    if (!selectedDatamart || !selectedTemplate) return;

    setIsLoading(true);
    setHasResults(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

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

      setGeneratedRequirements(mockRequirements);
      setHasResults(true);

    } catch (error) {
      console.error('Error generating requirements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (rating: 'positive' | 'negative', comment?: string) => {
    console.log('Feedback received:', { rating, comment, feature: 'reverse-engineering' });
  };

  const handleClearRequirements = () => {
    setRequirements('');
    setGeneratedRequirements('');
    setHasResults(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Control Panel */}
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

      {/* Results Section - Always Visible */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center justify-center py-12 border rounded-lg">
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
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium text-gray-700 mb-2">
              Сформированные требования появятся здесь
            </h4>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">
              Для генерации требований на основе реверс-инжиниринга:
            </p>
            <div className="text-left max-w-sm mx-auto space-y-2 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-dwh-navy text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Выберите витрину данных из списка</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-dwh-navy text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Выберите шаблон требований</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-dwh-navy text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>При необходимости добавьте дополнительные требования</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-dwh-navy text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span>Нажмите "Сгенерировать требования"</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReverseEngineering;
