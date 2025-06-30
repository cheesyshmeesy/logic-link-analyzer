
import React, { useState } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    // Simulate API call
    setTimeout(() => {
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
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
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
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
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
            <div className="border rounded-lg overflow-hidden">
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
          )}
        </div>
      )}
    </div>
  );
};

export default AttributeMapping;
