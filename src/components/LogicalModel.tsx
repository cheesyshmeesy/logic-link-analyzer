
import React, { useState } from 'react';
import { Database, Download, Plus, Link, Search, Filter, ThumbsUp, ThumbsDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const LogicalModel = () => {
  const [selectedDatamart, setSelectedDatamart] = useState('');
  const [selectedLayer, setSelectedLayer] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [entities, setEntities] = useState([
    { id: 1, name: 'Customer', description: 'Клиенты системы', type: 'Основная', source: 'dm.sales' },
    { id: 2, name: 'Product', description: 'Товары и услуги', type: 'Основная', source: 'dm.sales' },
    { id: 3, name: 'Order', description: 'Заказы клиентов', type: 'Транзакционная', source: 'dm.sales' },
  ]);

  const [attributes, setAttributes] = useState([
    { id: 1, entity: 'Customer', attribute: 'customer_id', dataType: 'INTEGER', mandatory: true, keyType: 'PK', description: 'Уникальный идентификатор' },
    { id: 2, entity: 'Customer', attribute: 'customer_name', dataType: 'VARCHAR(100)', mandatory: true, keyType: '', description: 'Наименование клиента' },
    { id: 3, entity: 'Product', attribute: 'product_id', dataType: 'INTEGER', mandatory: true, keyType: 'PK', description: 'Уникальный идентификатор' },
    { id: 4, entity: 'Product', attribute: 'product_name', dataType: 'VARCHAR(200)', mandatory: true, keyType: '', description: 'Наименование товара' },
    { id: 5, entity: 'Order', attribute: 'order_id', dataType: 'INTEGER', mandatory: true, keyType: 'PK', description: 'Уникальный идентификатор заказа' },
    { id: 6, entity: 'Order', attribute: 'customer_id', dataType: 'INTEGER', mandatory: true, keyType: 'FK', description: 'Связь с клиентом' },
  ]);

  const [relationships, setRelationships] = useState([
    { id: 1, fromEntity: 'Customer', toEntity: 'Order', relationshipType: 'One-to-Many', sourceAttribute: 'customer_id', targetAttribute: 'customer_id' },
    { id: 2, fromEntity: 'Product', toEntity: 'Order', relationshipType: 'Many-to-Many', sourceAttribute: 'product_id', targetAttribute: 'product_id' },
  ]);

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

  const handleBuildModel = async () => {
    if (!selectedDatamart) {
      toast({
        title: "Ошибка",
        description: "Выберите витрину данных",
        variant: "destructive"
      });
      return;
    }

    setIsBuilding(true);
    // Симуляция построения модели
    setTimeout(() => {
      setIsBuilding(false);
      toast({
        title: "Успех",
        description: "Логическая модель данных построена",
      });
    }, 3000);
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

  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAttributes = attributes.filter(attr =>
    (entityFilter === '' || attr.entity === entityFilter) &&
    (attr.attribute.toLowerCase().includes(searchTerm.toLowerCase()) ||
     attr.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Верхняя панель управления */}
      <div className="dwh-card">
        <h2 className="text-lg font-semibold text-dwh-navy mb-6">Построение логической модели данных</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dwh-navy">Витрина данных *</label>
            <Select value={selectedDatamart} onValueChange={setSelectedDatamart}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите витрину..." />
              </SelectTrigger>
              <SelectContent>
                {datamarts.map((datamart) => (
                  <SelectItem key={datamart} value={datamart}>
                    {datamart}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dwh-navy">Слой КХД</label>
            <Select value={selectedLayer} onValueChange={setSelectedLayer}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите слой..." />
              </SelectTrigger>
              <SelectContent>
                {layers.map((layer) => (
                  <SelectItem key={layer} value={layer}>
                    {layer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              onClick={handleBuildModel}
              disabled={isBuilding}
              className="dwh-button-primary w-full"
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
          </div>
        </div>
      </div>

      {/* Вкладки с таблицами */}
      <div className="dwh-card">
        <Tabs defaultValue="entities" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="entities">Сущности</TabsTrigger>
            <TabsTrigger value="attributes">Атрибуты</TabsTrigger>
            <TabsTrigger value="relationships">Связи</TabsTrigger>
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
                />
              </div>
              <Button onClick={() => handleExport('сущностей')} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                📥 Excel
              </Button>
            </div>

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
          </TabsContent>

          {/* Таблица атрибутов */}
          <TabsContent value="attributes" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск атрибутов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
                <Select value={entityFilter} onValueChange={setEntityFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Фильтр по сущности..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Все сущности</SelectItem>
                    {entities.map((entity) => (
                      <SelectItem key={entity.name} value={entity.name}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleExport('атрибутов')} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                📥 Excel
              </Button>
            </div>

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
          </TabsContent>

          {/* Таблица связей */}
          <TabsContent value="relationships" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-dwh-navy">Связи между сущностями</h3>
              <Button onClick={() => handleExport('связей')} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                📥 Excel
              </Button>
            </div>

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
          </TabsContent>
        </Tabs>
      </div>

      {/* Комплексный экспорт */}
      <div className="dwh-card">
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
      <div className="dwh-card">
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
