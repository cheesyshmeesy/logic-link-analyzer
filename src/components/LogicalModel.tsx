import React, { useState, useEffect } from 'react';
import { Database, Download, Plus, Link, Search, Filter, ThumbsUp, ThumbsDown, FileText, X, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ProgressWithStages from './ProgressWithStages';

const LogicalModel = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [selectedLayer, setSelectedLayer] = useState('');
  const [additionalDatamarts, setAdditionalDatamarts] = useState<string[]>([]);
  const [customRules, setCustomRules] = useState('');
  const [manualDatamarts, setManualDatamarts] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [stages, setStages] = useState<any[]>([]);
  const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const [entities, setEntities] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [relationships, setRelationships] = useState<any[]>([]);

  const datamarts = [
    'dm.sales',
    'dm.marketing',
    'dm.finance',
    'dm.operations'
  ];

  const layers = [
    'Слой КХД_1',
    'Слой КХД_2',
    'Слой КХД_3'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBuilding) {
      // Инициализация этапов
      const initialStages = [
        {
          id: 'discovery',
          name: 'Обнаружение сущностей',
          description: 'Поиск и идентификация основных сущностей данных',
          status: 'processing',
          progress: 0
        },
        {
          id: 'attributes',
          name: 'Анализ атрибутов',
          description: 'Определение атрибутов для каждой сущности',
          status: 'pending',
          progress: 0
        },
        {
          id: 'relationships',
          name: 'Построение связей',
          description: 'Выявление связей между сущностями',
          status: 'pending',
          progress: 0
        },
        {
          id: 'validation',
          name: 'Валидация модели',
          description: 'Проверка целостности логической модели',
          status: 'pending',
          progress: 0
        }
      ];
      
      setStages(initialStages);
      setCurrentStage('discovery');
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
          setCurrentStage('discovery');
        } else if (currentProgress <= 50) {
          updatedStages[0].status = 'completed';
          updatedStages[0].progress = 100;
          updatedStages[1].progress = ((currentProgress - 25) / 25) * 100;
          updatedStages[1].status = 'processing';
          setCurrentStage('attributes');
        } else if (currentProgress <= 75) {
          updatedStages[0].status = 'completed';
          updatedStages[0].progress = 100;
          updatedStages[1].status = 'completed';
          updatedStages[1].progress = 100;
          updatedStages[2].progress = ((currentProgress - 50) / 25) * 100;
          updatedStages[2].status = 'processing';
          setCurrentStage('relationships');
        } else if (currentProgress <= 100) {
          updatedStages[0].status = 'completed';
          updatedStages[0].progress = 100;
          updatedStages[1].status = 'completed';
          updatedStages[1].progress = 100;
          updatedStages[2].status = 'completed';
          updatedStages[2].progress = 100;
          updatedStages[3].progress = ((currentProgress - 75) / 25) * 100;
          updatedStages[3].status = 'processing';
          setCurrentStage('validation');
        }
        
        if (currentProgress >= 100) {
          updatedStages[3].status = 'completed';
          updatedStages[3].progress = 100;
          
          // Завершение процесса
          // Мок данные для результатов
          const mockEntities = [
            { id: 1, name: 'Customer', description: 'Клиенты системы', type: 'Основная', source: selectedDatamart },
            { id: 2, name: 'Product', description: 'Товары и услуги', type: 'Основная', source: selectedDatamart },
            { id: 3, name: 'Order', description: 'Заказы клиентов', type: 'Транзакционная', source: selectedDatamart },
          ];

          const mockAttributes = [
            { id: 1, entity: 'Customer', attribute: 'customer_id', dataType: 'INTEGER', mandatory: true, keyType: 'PK', description: 'Уникальный идентификатор' },
            { id: 2, entity: 'Customer', attribute: 'customer_name', dataType: 'VARCHAR(100)', mandatory: true, keyType: '', description: 'Наименование клиента' },
            { id: 3, entity: 'Product', attribute: 'product_id', dataType: 'INTEGER', mandatory: true, keyType: 'PK', description: 'Уникальный идентификатор' },
            { id: 4, entity: 'Product', attribute: 'product_name', dataType: 'VARCHAR(200)', mandatory: true, keyType: '', description: 'Наименование товара' },
            { id: 5, entity: 'Order', attribute: 'order_id', dataType: 'INTEGER', mandatory: true, keyType: 'PK', description: 'Уникальный идентификатор заказа' },
            { id: 6, entity: 'Order', attribute: 'customer_id', dataType: 'INTEGER', mandatory: true, keyType: 'FK', description: 'Связь с клиентом' },
          ];

          const mockRelationships = [
            { id: 1, fromEntity: 'Customer', toEntity: 'Order', relationshipType: 'One-to-Many', sourceAttribute: 'customer_id', targetAttribute: 'customer_id' },
            { id: 2, fromEntity: 'Product', toEntity: 'Order', relationshipType: 'Many-to-Many', sourceAttribute: 'product_id', targetAttribute: 'product_id' },
          ];

          setEntities(mockEntities);
          setAttributes(mockAttributes);
          setRelationships(mockRelationships);
          setHasResults(true);
          setIsBuilding(false);
          
          toast({
            title: "Успех",
            description: "Логическая модель данных построена",
          });
          
          clearInterval(interval);
        }
        
        setStages(updatedStages);
      }, 15000); // Обновление каждые 15 секунд
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBuilding, selectedDatamart, toast]);

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

  const handleBuildModel = async () => {
    if (!selectedDatamart) {
      toast({
        title: "Ошибка",
        description: "Выберите основную витрину данных",
        variant: "destructive"
      });
      return;
    }

    setIsBuilding(true);
    setHasResults(false);
  };

  const handleCancel = () => {
    if (intervalRef) {
      clearInterval(intervalRef);
      setIntervalRef(null);
    }
    setIsBuilding(false);
    setProgress(0);
    setCurrentStage('');
    setStages([]);
    
    toast({
      title: "Процесс отменен",
      description: "Построение логической модели данных прервано",
    });
  };

  const handleExport = (type: string) => {
    toast({
      title: "Экспорт",
      description: `Экспорт ${type} начат`,
    });
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    if (type === 'positive') {
      toast({
        title: "Спасибо за оценку!",
        description: "Ваш отзыв помогает нам улучшать систему",
      });
    } else {
      setIsDialogOpen(true);
    }
  };

  const submitFeedback = () => {
    toast({
      title: "Спасибо за отзыв!",
      description: "Ваши комментарии будут учтены",
    });
    setFeedback('');
    setIsDialogOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.name.endsWith('.docx') || file.name.endsWith('.xlsx')
    );
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAttributes = attributes.filter(attr =>
    (entityFilter === '' || attr.entity === entityFilter) &&
    (attr.attribute.toLowerCase().includes(searchTerm.toLowerCase()) ||
     attr.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const EmptyState = ({ type }: { type: string }) => (
    <div className="text-center py-12 border rounded-lg bg-gray-50">
      <Database className="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <h4 className="text-lg font-medium text-gray-700 mb-2">
        {type} появятся здесь
      </h4>
      <p className="text-gray-500 mb-4 max-w-md mx-auto">
        Для получения логической модели данных:
      </p>
      <div className="text-left max-w-sm mx-auto space-y-2 text-sm text-gray-600">
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-5 h-5 bg-dwh-navy text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
          <span>Выберите основную витрину данных из списка</span>
        </div>
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-5 h-5 bg-dwh-navy text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
          <span>При необходимости укажите слой КХД и дополнительные параметры</span>
        </div>
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-5 h-5 bg-dwh-navy text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
          <span>Нажмите кнопку "Построить ЛМД"</span>
        </div>
        <div className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-5 h-5 bg-dwh-navy text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
          <span>Дождитесь завершения анализа</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Control Panel */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dwh-navy">Основная витрина данных *</label>
            <Select value={selectedDatamart} onValueChange={setSelectedDatamart} disabled={isBuilding}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите основную витрину..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                {datamarts.map((datamart) => (
                  <SelectItem key={datamart} value={datamart} className="hover:bg-dwh-light">
                    {datamart}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dwh-navy">Слой КХД</label>
            <Select value={selectedLayer} onValueChange={setSelectedLayer} disabled={isBuilding}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите слой..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                {layers.map((layer) => (
                  <SelectItem key={layer} value={layer} className="hover:bg-dwh-light">
                    {layer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end space-x-2">
            <Button 
              onClick={handleBuildModel}
              disabled={!selectedDatamart || isBuilding}
              className="dwh-button-primary flex-1"
            >
              {isBuilding ? (
                <>Построение...</>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Построить ЛМД
                </>
              )}
            </Button>
            
            {isBuilding && (
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* User Additions Section */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-dwh-navy mb-3">Дополнительные требования</h3>
          
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
                disabled={isBuilding}
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
                  disabled={isBuilding}
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
                  disabled={isBuilding}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Manual Datamarts List */}
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Или укажите витрины вручную (через запятую)
            </label>
            <Input
              placeholder="dm.sales, dm.marketing, dm.finance..."
              value={manualDatamarts}
              onChange={(e) => setManualDatamarts(e.target.value)}
              disabled={isBuilding}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Прикрепить документы (.docx, .xlsx)
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept=".docx,.xlsx"
                multiple
                onChange={handleFileUpload}
                disabled={isBuilding}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Выбрать файлы
              </label>
            </div>
            {attachedFiles.length > 0 && (
              <div className="space-y-1">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <Button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      variant="ghost"
                      size="sm"
                      disabled={isBuilding}
                      className="text-red-600 hover:bg-red-50 p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Специфические правила построения модели
            </label>
            <Textarea
              placeholder="Укажите особые требования к построению логической модели данных..."
              value={customRules}
              onChange={(e) => setCustomRules(e.target.value)}
              className="min-h-[80px]"
              disabled={isBuilding}
            />
          </div>
        </div>
      </div>

      {/* Progress Section */}
      {isBuilding && (
        <ProgressWithStages
          stages={stages}
          currentStage={currentStage}
          overallProgress={progress}
          title="Построение логической модели данных"
        />
      )}

      {/* Results Section - Always Visible */}
      {!isBuilding && (
        <div className="space-y-4">
          <Tabs defaultValue="entities" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="entities">Сущности {hasResults ? `(${entities.length})` : ''}</TabsTrigger>
              <TabsTrigger value="attributes">Атрибуты {hasResults ? `(${attributes.length})` : ''}</TabsTrigger>
              <TabsTrigger value="relationships">Связи {hasResults ? `(${relationships.length})` : ''}</TabsTrigger>
            </TabsList>

            {/* Таблица сущностей */}
            <TabsContent value="entities" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Поиск по названию или описанию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                    disabled={!hasResults}
                  />
                </div>
                {hasResults && (
                  <Button onClick={() => handleExport('сущностей')} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    📥 Excel
                  </Button>
                )}
              </div>

              {hasResults ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Название</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead>Тип</TableHead>
                        <TableHead>Источник данных</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntities.map((entity) => (
                        <TableRow key={entity.id}>
                          <TableCell>{entity.id}</TableCell>
                          <TableCell className="font-medium">{entity.name}</TableCell>
                          <TableCell>{entity.description}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-dwh-cyan/20 text-dwh-navy rounded-full text-xs">
                              {entity.type}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-sm text-dwh-cyan">{entity.source}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState type="Сущности" />
              )}
            </TabsContent>

            <TabsContent value="attributes" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Поиск атрибутов..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                    disabled={!hasResults}
                  />
                  <Select value={entityFilter} onValueChange={setEntityFilter} disabled={!hasResults}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Фильтр по сущности..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      <SelectItem value="">Все сущности</SelectItem>
                      {entities.map((entity) => (
                        <SelectItem key={entity.name} value={entity.name} className="hover:bg-dwh-light">
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {hasResults && (
                  <Button onClick={() => handleExport('атрибутов')} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    📥 Excel
                  </Button>
                )}
              </div>

              {hasResults ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Сущность</TableHead>
                        <TableHead>Атрибут</TableHead>
                        <TableHead>Тип данных</TableHead>
                        <TableHead>Обязательный</TableHead>
                        <TableHead>PK/FK</TableHead>
                        <TableHead>Описание</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAttributes.map((attr) => (
                        <TableRow key={attr.id}>
                          <TableCell>{attr.id}</TableCell>
                          <TableCell className="font-medium">{attr.entity}</TableCell>
                          <TableCell className="font-mono text-sm">{attr.attribute}</TableCell>
                          <TableCell className="font-mono text-sm text-dwh-cyan">{attr.dataType}</TableCell>
                          <TableCell>
                            {attr.mandatory ? (
                              <span className="text-red-600">Да</span>
                            ) : (
                              <span className="text-gray-500">Нет</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {attr.keyType && (
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                attr.keyType === 'PK' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {attr.keyType}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{attr.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState type="Атрибуты" />
              )}
            </TabsContent>

            <TabsContent value="relationships" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-dwh-navy">Связи между сущностями</h3>
                {hasResults && (
                  <Button onClick={() => handleExport('связей')} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    📥 Excel
                  </Button>
                )}
              </div>

              {hasResults ? (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>От (сущность)</TableHead>
                        <TableHead>К (сущность)</TableHead>
                        <TableHead>Тип связи</TableHead>
                        <TableHead>Атрибут-источник</TableHead>
                        <TableHead>Атрибут-цель</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relationships.map((rel) => (
                        <TableRow key={rel.id}>
                          <TableCell>{rel.id}</TableCell>
                          <TableCell className="font-medium">{rel.fromEntity}</TableCell>
                          <TableCell className="font-medium">{rel.toEntity}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-dwh-navy/10 text-dwh-navy rounded-full text-xs">
                              {rel.relationshipType}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{rel.sourceAttribute}</TableCell>
                          <TableCell className="font-mono text-sm">{rel.targetAttribute}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState type="Связи" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Export and Feedback sections - only show when there are results */}
      {hasResults && (
        <>
          {/* Комплексный экспорт */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-dwh-navy">Экспорт данных</h3>
                <p className="text-sm text-gray-600">Скачать все таблицы в одном файле Excel</p>
              </div>
              <Button onClick={() => handleExport('всех данных')} className="dwh-button-secondary">
                <FileText className="w-4 h-4 mr-2" />
                📥 Экспортировать все
              </Button>
            </div>
          </div>

          {/* Блок оценки */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-dwh-navy">Оцените результат:</h3>
                <p className="text-sm text-gray-600">Ваша оценка поможет улучшить качество анализа</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleFeedback('positive')}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  👍 Полезно
                </Button>
                <Button
                  onClick={() => handleFeedback('negative')}
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  👎 Неточно
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Диалог для негативной оценки */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Расскажите, что можно улучшить</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Опишите, что показалось неточным или что можно улучшить..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={submitFeedback} className="dwh-button-primary">
                Отправить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogicalModel;
