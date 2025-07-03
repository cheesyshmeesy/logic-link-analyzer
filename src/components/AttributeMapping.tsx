
import React, { useState, useEffect } from 'react';
import { BarChart3, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ResultFeedback from './ResultFeedback';
import ProgressWithStages from './ProgressWithStages';

const AttributeMapping = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [mappingResults, setMappingResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [stages, setStages] = useState<any[]>([]);

  const datamarts = [
    'dm.sales',
    'dm.clients', 
    'dm.products'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading) {
      // Инициализация этапов
      const initialStages = [
        {
          id: 'analysis',
          name: 'Анализ структуры данных',
          description: 'Сканирование исходных таблиц и анализ схемы',
          status: 'processing',
          progress: 0
        },
        {
          id: 'mapping',
          name: 'Построение маппинга',
          description: 'Создание связей между атрибутами источника и цели',
          status: 'pending',
          progress: 0
        },
        {
          id: 'validation',
          name: 'Валидация результатов',
          description: 'Проверка корректности созданных связей',
          status: 'pending',
          progress: 0
        },
        {
          id: 'finalization',
          name: 'Финализация',
          description: 'Подготовка финального отчета',
          status: 'pending',
          progress: 0
        }
      ];
      
      setStages(initialStages);
      setCurrentStage('analysis');
      setProgress(0);

      let currentProgress = 0;
      let stageIndex = 0;
      
      interval = setInterval(() => {
        currentProgress += 25;
        setProgress(currentProgress);

        // Обновление этапов каждые 15 секунд
        const updatedStages = [...initialStages];
        
        if (currentProgress <= 25) {
          // Первый этап
          updatedStages[0].progress = (currentProgress / 25) * 100;
          updatedStages[0].status = 'processing';
          setCurrentStage('analysis');
        } else if (currentProgress <= 50) {
          // Второй этап
          updatedStages[0].status = 'completed';
          updatedStages[0].progress = 100;
          updatedStages[1].progress = ((currentProgress - 25) / 25) * 100;
          updatedStages[1].status = 'processing';
          setCurrentStage('mapping');
        } else if (currentProgress <= 75) {
          // Третий этап
          updatedStages[0].status = 'completed';
          updatedStages[0].progress = 100;
          updatedStages[1].status = 'completed';
          updatedStages[1].progress = 100;
          updatedStages[2].progress = ((currentProgress - 50) / 25) * 100;
          updatedStages[2].status = 'processing';
          setCurrentStage('validation');
        } else if (currentProgress <= 100) {
          // Четвертый этап
          updatedStages[0].status = 'completed';
          updatedStages[0].progress = 100;
          updatedStages[1].status = 'completed';
          updatedStages[1].progress = 100;
          updatedStages[2].status = 'completed';
          updatedStages[2].progress = 100;
          updatedStages[3].progress = ((currentProgress - 75) / 25) * 100;
          updatedStages[3].status = 'processing';
          setCurrentStage('finalization');
        }
        
        if (currentProgress >= 100) {
          updatedStages[3].status = 'completed';
          updatedStages[3].progress = 100;
          
          // Завершение процесса
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
          clearInterval(interval);
        }
        
        setStages(updatedStages);
      }, 15000); // Обновление каждые 15 секунд
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleBuildMapping = async () => {
    if (!selectedDatamart) return;
    
    setIsLoading(true);
    setHasResults(false);
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
            <Select value={selectedDatamart} onValueChange={setSelectedDatamart} disabled={isLoading}>
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

      {/* Progress Section */}
      {isLoading && (
        <ProgressWithStages
          stages={stages}
          currentStage={currentStage}
          overallProgress={progress}
          title="Построение атрибутного маппинга"
        />
      )}

      {/* Results Section */}
      {!isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dwh-navy">
              Результаты маппинга {hasResults ? `(${mappingResults.length})` : ''}
            </h3>
            {hasResults && (
              <Button className="dwh-button-secondary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
            )}
          </div>

          {hasResults ? (
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
      )}
    </div>
  );
};

export default AttributeMapping;
