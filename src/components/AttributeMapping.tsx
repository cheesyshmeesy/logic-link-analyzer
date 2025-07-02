
import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ResultFeedback from './ResultFeedback';

const AttributeMapping = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [mappingResults, setMappingResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const datamarts = [
    'dm.sales',
    'dm.clients', 
    'dm.products'
  ];

  const handleBuildMapping = async () => {
    if (!selectedDatamart) return;
    
    setIsLoading(true);
    setHasResults(false);
    
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
      
      setMappingResults(mockResults);
      setHasResults(true);
      
    } catch (error) {
      console.error('Error building mapping:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (rating: 'positive' | 'negative', comment?: string) => {
    console.log('Feedback received:', { rating, comment, feature: 'attribute-mapping' });
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

      {/* Results Section - Always Visible */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dwh-navy">
            Результаты маппинга {hasResults ? `(${mappingResults.length})` : ''}
          </h3>
          {hasResults && !isLoading && (
            <Button className="dwh-button-secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 border rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dwh-navy"></div>
            <span className="ml-3 text-dwh-navy">Анализ структуры данных...</span>
          </div>
        ) : hasResults ? (
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
            <ResultFeedback onFeedback={handleFeedback} />
          </>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium text-gray-700 mb-2">
              Результаты маппинга появятся здесь
            </h4>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">
              Для получения результатов атрибутного маппинга:
            </p>
            <div className="text-left max-w-sm mx-auto space-y-2 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-dwh-navy text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Выберите витрину данных из списка</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-dwh-navy text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Нажмите кнопку "Построить атрибутный маппинг"</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-dwh-navy text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Дождитесь завершения анализа</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributeMapping;
