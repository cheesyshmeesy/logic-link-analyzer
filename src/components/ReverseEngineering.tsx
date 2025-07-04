import React, { useState, useEffect } from 'react';
import { Search, Download, FileText, Trash2, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import ResultFeedback from './ResultFeedback';
import ProgressWithStages from './ProgressWithStages';

const ReverseEngineering = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [additionalDatamarts, setAdditionalDatamarts] = useState<string[]>([]);
  const [requirements, setRequirements] = useState('');
  const [customRules, setCustomRules] = useState('');
  const [generatedRequirements, setGeneratedRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [stages, setStages] = useState<any[]>([]);
  const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null);

  const datamarts = [
    'dm.sales',
    'dm.clients',
    'dm.products'
  ];

  const templates = [
    'ФТ - Функциональные требования',
    'БТ - Бизнес требования'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading) {
      // Инициализация этапов
      const initialStages = [
        {
          id: 'scanning',
          name: 'Сканирование структуры',
          description: 'Анализ таблиц, связей и метаданных витрины',
          status: 'processing',
          progress: 0
        },
        {
          id: 'analysis',
          name: 'Анализ бизнес-логики',
          description: 'Извлечение бизнес-правил и процессов',
          status: 'pending',
          progress: 0
        },
        {
          id: 'generation',
          name: 'Генерация требований',
          description: 'Формирование документа требований',
          status: 'pending',
          progress: 0
        },
        {
          id: 'formatting',
          name: 'Форматирование',
          description: 'Применение выбранного шаблона',
          status: 'pending',
          progress: 0
        }
      ];
      
      setStages(initialStages);
      setCurrentStage('scanning');
      setProgress(0);

      let currentProgress = 0;
      
      interval = setInterval(() => {
        currentProgress += 25;
        setProgress(currentProgress);

        // Обновление этапов каждые 15 секунд
        const updatedStages = [...initialStages];
        
        if (currentProgress <= 25) {
          updatedStages[0].progress = (currentProgress / 25) * 100;
          updatedStages[0].status = 'processing';
          setCurrentStage('scanning');
        } else if (currentProgress <= 50) {
          updatedStages[0].status = 'completed';
          updatedStages[0].progress = 100;
          updatedStages[1].progress = ((currentProgress - 25) / 25) * 100;
          updatedStages[1].status = 'processing';
          setCurrentStage('analysis');
        } else if (currentProgress <= 75) {
          updatedStages[0].status = 'completed';
          updatedStages[0].progress = 100;
          updatedStages[1].status = 'completed';
          updatedStages[1].progress = 100;
          updatedStages[2].progress = ((currentProgress - 50) / 25) * 100;
          updatedStages[2].status = 'processing';
          setCurrentStage('generation');
        } else if (currentProgress <= 100) {
          updatedStages[0].status = 'completed';
          updatedStages[0].progress = 100;
          updatedStages[1].status = 'completed';
          updatedStages[1].progress = 100;
          updatedStages[2].status = 'completed';
          updatedStages[2].progress = 100;
          updatedStages[3].progress = ((currentProgress - 75) / 25) * 100;
          updatedStages[3].status = 'processing';
          setCurrentStage('formatting');
        }
        
        if (currentProgress >= 100) {
          updatedStages[3].status = 'completed';
          updatedStages[3].progress = 100;
          
          // Завершение процесса
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
- Транзакционная система для операций

${requirements ? `\n### 5. Дополнительные требования\n${requirements}` : ''}`;

          setGeneratedRequirements(mockRequirements);
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
  }, [isLoading, selectedDatamart, selectedTemplate, requirements]);

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

  const handleGenerateRequirements = async () => {
    if (!selectedDatamart || !selectedTemplate) return;

    setIsLoading(true);
    setHasResults(false);
  };

  const handleCancel = () => {
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

          <div>
            <label className="block text-sm font-medium text-dwh-navy mb-2">
              Шаблон требований <span className="text-red-500">*</span>
            </label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate} disabled={isLoading}>
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
              Специфические правила анализа
            </label>
            <Textarea
              placeholder="Укажите особые требования к анализу или генерации требований..."
              value={customRules}
              onChange={(e) => setCustomRules(e.target.value)}
              className="min-h-[80px]"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-dwh-navy">
              Дополнительные требования
            </label>
            {requirements && !isLoading && (
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
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            onClick={handleGenerateRequirements}
            disabled={!selectedDatamart || !selectedTemplate || isLoading}
            className="dwh-button-primary"
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? 'Генерация...' : 'Сгенерировать требования'}
          </Button>
          
          {isLoading && (
            <Button 
              onClick={handleCancel}
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
          title="Генерация требований"
        />
      )}

      {/* Results Section */}
      {!isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-dwh-navy">
              Сформированные требования
            </h3>
            {hasResults && (
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

          {hasResults ? (
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
      )}
    </div>
  );
};

export default ReverseEngineering;
