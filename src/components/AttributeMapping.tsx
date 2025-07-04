import React, { useState, useEffect } from 'react';
import { BarChart3, Download, FileSpreadsheet, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import ResultFeedback from './ResultFeedback';
import ProgressWithStages from './ProgressWithStages';
import CancelConfirmDialog from './CancelConfirmDialog';

const AttributeMapping = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [additionalDatamarts, setAdditionalDatamarts] = useState<string[]>([]);
  const [customRules, setCustomRules] = useState('');
  const [mappingResults, setMappingResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [stages, setStages] = useState<any[]>([]);
  const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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
      
      setIntervalRef(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleAddDatamart = () => {
    setAdditionalDatamarts([...additionalDatamarts, '']);
  };

  const handleRemoveDatamart = (index: number) => {
    setAdditionalDatamarts(additionalDatamarts.filter((_, i) => i !== index));
  };

  const handleDatamartChange = (index: number, value: string) => {
    const updated = [...additionalDatamarts];
    updated[index] = value;
    setAdditionalDatamarts(updated);
  };

  const handleBuildMapping = async () => {
    if (!selectedDatamart) return;
    
    setIsLoading(true);
    setHasResults(false);
  };

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
    if (intervalRef) {
      clearInterval(intervalRef);
      setIntervalRef(null);
    }
    setIsLoading(false);
    setProgress(0);
    setCurrentStage('');
    setStages([]);
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
              Основная витрина <span className="text-red-500">*</span>
            </label>
            <Select value={selectedDatamart} onValueChange={setSelectedDatamart} disabled={isLoading}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите основную витрину" />
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

        {/* User Additions Section */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-dwh-navy mb-3">Дополнительные параметры</h3>
          
          {/* Additional Datamarts */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Дополнительные витрины для анализа
              </label>
              <Button
                type="button"
                onClick={handleAddDatamart}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="text-dwh-navy border-dwh-navy hover:bg-dwh-light"
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить
              </Button>
            </div>
            
            {additionalDatamarts.map((datamart, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Select
                  value={datamart}
                  onValueChange={(value) => handleDatamartChange(index, value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Выберите витрину..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    {datamarts.filter(dm => dm !== selectedDatamart && !additionalDatamarts.includes(dm)).map((dm) => (
                      <SelectItem key={dm} value={dm} className="hover:bg-dwh-light">
                        {dm}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={() => handleRemoveDatamart(index)}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Custom Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дополнительные правила маппинга
            </label>
            <Textarea
              placeholder="Укажите специфические правила или ограничения для маппинга атрибутов..."
              value={customRules}
              onChange={(e) => setCustomRules(e.target.value)}
              className="min-h-[80px]"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            onClick={handleBuildMapping}
            disabled={!selectedDatamart || isLoading}
            className="dwh-button-primary"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {isLoading ? 'Построение...' : 'Построить атрибутный маппинг'}
          </Button>
          
          {isLoading && (
            <Button 
              onClick={handleCancelClick}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Отменить
            </Button>
          )}
        </div>
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

      {/* Cancel Confirmation Dialog */}
      <CancelConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelConfirm}
        title="построение атрибутного маппинга"
        description="Текущий прогресс анализа будет потерян, и вам потребуется начать заново."
      />
    </div>
  );
};

export default AttributeMapping;
