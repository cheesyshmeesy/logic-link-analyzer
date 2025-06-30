
import React, { useState } from 'react';
import { ChevronDown, Play, Download, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const AttributeMapping = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const datamarts = [
    { value: 'dm.sales', label: 'dm.sales - Витрина продаж' },
    { value: 'dm.clients', label: 'dm.clients - Витрина клиентов' },
    { value: 'dm.products', label: 'dm.products - Витрина товаров' },
    { value: 'dm.finance', label: 'dm.finance - Финансовая витрина' },
  ];

  const activeRequests = [
    {
      id: 'REQ-001',
      type: 'Атрибутный маппинг',
      status: 'В работе',
      progress: 75,
      datamart: 'dm.sales'
    }
  ];

  const mappingResults = [
    {
      source: 'stg_sales.customer_id',
      target: 'dm_sales.client_key',
      transformation: 'Прямое соответствие'
    },
    {
      source: 'stg_sales.product_code',
      target: 'dm_sales.product_key',
      transformation: 'Lookup через справочник'
    },
    {
      source: 'stg_sales.sale_amount',
      target: 'dm_sales.revenue_amt',
      transformation: 'Валютное преобразование'
    },
    {
      source: 'stg_sales.sale_date',
      target: 'dm_sales.date_key',
      transformation: 'Преобразование в ключ даты'
    }
  ];

  const handleBuildMapping = () => {
    if (!selectedDatamart) return;
    
    setIsBuilding(true);
    setProgress(0);
    setShowResults(false);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBuilding(false);
          setShowResults(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'В работе':
        return <Clock className="w-4 h-4 text-dwh-cyan animate-pulse" />;
      case 'Завершено':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Ошибка':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Data Mart Selection */}
      <div className="dwh-card">
        <h2 className="text-lg font-semibold text-dwh-navy mb-4">Выбор витрины</h2>
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-dwh-navy mb-2">
              Выберите витрину
            </label>
            <Select value={selectedDatamart} onValueChange={setSelectedDatamart}>
              <SelectTrigger className="w-full">
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
          <Button 
            onClick={handleBuildMapping}
            disabled={!selectedDatamart || isBuilding}
            className="dwh-button-primary flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Построить атрибутный маппинг</span>
          </Button>
        </div>
      </div>

      {/* Progress */}
      {isBuilding && (
        <div className="dwh-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-dwh-navy">Построение маппинга</h3>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">
            Анализ структуры витрины {selectedDatamart}...
          </p>
        </div>
      )}

      {/* Results */}
      {showResults && (
        <div className="dwh-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dwh-navy">
              Результаты маппинга ({mappingResults.length})
            </h3>
            <Button className="dwh-button-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Экспорт в Excel</span>
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-dwh-navy">Источник (STG)</th>
                  <th className="text-left py-3 px-4 font-medium text-dwh-navy">Целевой атрибут</th>
                  <th className="text-left py-3 px-4 font-medium text-dwh-navy">Тип преобразования</th>
                </tr>
              </thead>
              <tbody>
                {mappingResults.map((result, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-dwh-light/30">
                    <td className="py-3 px-4 font-mono text-sm text-gray-700">{result.source}</td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-700">{result.target}</td>
                    <td className="py-3 px-4 text-sm">{result.transformation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Active Requests Queue */}
      <Accordion type="single" collapsible className="dwh-card">
        <AccordionItem value="queue" className="border-none">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-dwh-navy">Активные запросы</h3>
              <span className="bg-dwh-cyan text-dwh-navy px-2 py-1 rounded-full text-xs font-medium">
                {activeRequests.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-4">
              {activeRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-dwh-light rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium text-dwh-navy">{request.id}</p>
                      <p className="text-sm text-gray-600">{request.type} - {request.datamart}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-dwh-navy">{request.status}</p>
                      <div className="w-24">
                        <Progress value={request.progress} className="h-2" />
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AttributeMapping;
