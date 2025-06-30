
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

  const datamarts = [
    { value: 'dm.sales', label: 'dm.sales - Витрина продаж' },
    { value: 'dm.clients', label: 'dm.clients - Витрина клиентов' },
    { value: 'dm.products', label: 'dm.products - Витрина товаров' },
  ];

  const templates = [
    { value: 'ft', label: 'ФТ - Функциональные требования' },
    { value: 'ods', label: 'ОДС - Операционное хранилище данных' },
    { value: 'dwd', label: 'КХД - Корпоративное хранилище данных' },
  ];

  const handleGenerate = () => {
    setGeneratedContent(`# Требования к витрине ${selectedDatamart}

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
- Прибыль (profit_amt)`);
    setShowFeedback(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="dwh-card">
        <h2 className="text-lg font-semibold text-dwh-navy mb-4">SQL → Бизнес-требования</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-dwh-navy mb-2">
              Выберите витрину
            </label>
            <Select value={selectedDatamart} onValueChange={setSelectedDatamart}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите витрину" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                {datamarts.map((dm) => (
                  <SelectItem key={dm.value} value={dm.value} className="hover:bg-dwh-light">
                    {dm.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dwh-navy mb-2">
              Шаблон требований
            </label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите шаблон" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                {templates.map((template) => (
                  <SelectItem key={template.value} value={template.value} className="hover:bg-dwh-light">
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleGenerate}
          disabled={!selectedDatamart || !selectedTemplate}
          className="dwh-button-primary"
        >
          <FileText className="w-4 h-4 mr-2" />
          Сгенерировать требования
        </Button>
      </div>

      {generatedContent && (
        <div className="dwh-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dwh-navy">Сгенерированные требования</h3>
            <div className="flex space-x-2">
              <Button className="dwh-button-secondary">
                <Download className="w-4 h-4 mr-2" />
                DOCX
              </Button>
              <Button className="dwh-button-secondary">
                <Download className="w-4 h-4 mr-2" />
                Confluence
              </Button>
            </div>
          </div>
          
          <div className="bg-dwh-light p-4 rounded-lg mb-4">
            <Textarea 
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="min-h-[400px] bg-white"
            />
          </div>

          {showFeedback && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">Полезен ли этот ответ?</p>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Полезно
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                  <ThumbsDown className="w-4 h-4 mr-1" />
                  Неточно
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReverseEngineering;
