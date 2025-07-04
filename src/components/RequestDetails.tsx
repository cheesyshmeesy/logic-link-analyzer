
import React from 'react';
import { CheckCircle, XCircle, Clock, User, Calendar, Timer, MessageCircle, FileText, Database, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HistoryItem } from './RequestHistory';

interface RequestDetailsProps {
  item: HistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ item, isOpen, onClose }) => {
  if (!item) return null;

  const getStatusIcon = (status: HistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (status: HistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return 'Завершен успешно';
      case 'failed':
        return 'Завершен с ошибкой';
    }
  };

  const getTypeText = (type: HistoryItem['type']) => {
    switch (type) {
      case 'mapping':
        return 'Атрибутный маппинг';
      case 'reverse':
        return 'Реверс-инжиниринг';
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getDuration = (start: Date, end: Date) => {
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (duration < 60) return `${duration} секунд`;
    if (duration < 3600) return `${Math.floor(duration / 60)} минут ${duration % 60} секунд`;
    return `${Math.floor(duration / 3600)} часов ${Math.floor((duration % 3600) / 60)} минут`;
  };

  const getRatingColor = (rating?: 'positive' | 'negative') => {
    switch (rating) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingText = (rating?: 'positive' | 'negative') => {
    switch (rating) {
      case 'positive':
        return 'Положительная';
      case 'negative':
        return 'Отрицательная';
      default:
        return 'Не оценен';
    }
  };

  // Генерация детальных результатов в зависимости от типа запроса
  const getDetailedResults = () => {
    if (item.status !== 'completed') return null;

    if (item.type === 'mapping') {
      const mappingResults = [
        { source: 'stg.sales.customer_id', target: 'dim_customer.customer_key', transformation: 'Direct mapping', confidence: '95%' },
        { source: 'stg.sales.product_id', target: 'dim_product.product_key', transformation: 'Lookup transformation', confidence: '92%' },
        { source: 'stg.sales.amount', target: 'fact_sales.sales_amount', transformation: 'Data type conversion', confidence: '98%' },
        { source: 'stg.sales.order_date', target: 'dim_date.date_key', transformation: 'Date key lookup', confidence: '89%' },
        { source: 'stg.sales.quantity', target: 'fact_sales.quantity', transformation: 'Direct mapping', confidence: '100%' }
      ];

      return (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Результаты атрибутного маппинга</span>
          </h4>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Источник</TableHead>
                  <TableHead>Цель</TableHead>
                  <TableHead>Преобразование</TableHead>
                  <TableHead>Уверенность</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappingResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{result.source}</TableCell>
                    <TableCell className="font-mono text-sm">{result.target}</TableCell>
                    <TableCell>{result.transformation}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        {result.confidence}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Итого:</strong> Создано {mappingResults.length} связей маппинга. 
              Средняя уверенность: {Math.round(mappingResults.reduce((acc, r) => acc + parseInt(r.confidence), 0) / mappingResults.length)}%
            </p>
          </div>
        </div>
      );
    }

    if (item.type === 'reverse') {
      const reverseResults = [
        { table: 'customers', columns: 12, primaryKey: 'customer_id', foreignKeys: 2, indexes: 3 },
        { table: 'orders', columns: 8, primaryKey: 'order_id', foreignKeys: 1, indexes: 2 },
        { table: 'products', columns: 15, primaryKey: 'product_id', foreignKeys: 3, indexes: 4 },
        { table: 'order_items', columns: 6, primaryKey: 'item_id', foreignKeys: 2, indexes: 3 }
      ];

      return (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Результаты реверс-инжиниринга</span>
          </h4>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Таблица</TableHead>
                  <TableHead>Колонки</TableHead>
                  <TableHead>Первичный ключ</TableHead>
                  <TableHead>Внешние ключи</TableHead>
                  <TableHead>Индексы</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reverseResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{result.table}</TableCell>
                    <TableCell>{result.columns}</TableCell>
                    <TableCell className="font-mono text-sm">{result.primaryKey}</TableCell>
                    <TableCell>{result.foreignKeys}</TableCell>
                    <TableCell>{result.indexes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Итого:</strong> Проанализировано {reverseResults.length} таблиц, 
              найдено {reverseResults.reduce((acc, r) => acc + r.columns, 0)} колонок, 
              {reverseResults.reduce((acc, r) => acc + r.foreignKeys, 0)} связей между таблицами
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const getProcessingStages = () => {
    const baseStages = [
      { name: 'Инициализация', status: 'completed', duration: '2 сек' },
      { name: 'Анализ данных', status: 'completed', duration: '18 сек' },
      { name: 'Обработка', status: 'completed', duration: '25 сек' },
      { name: 'Валидация', status: 'completed', duration: '12 сек' },
      { name: 'Финализация', status: 'completed', duration: '3 сек' }
    ];

    if (item.status === 'failed') {
      baseStages[2].status = 'failed';
      baseStages[3].status = 'skipped';
      baseStages[4].status = 'skipped';
    }

    return baseStages;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {getStatusIcon(item.status)}
            <span>{item.title}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="results">Подробные результаты</TabsTrigger>
            <TabsTrigger value="technical">Техническая информация</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Основная информация */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-sm">
                    {getTypeText(item.type)}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Начало: {formatDateTime(item.startTime)}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Окончание: {formatDateTime(item.endTime)}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Timer className="w-4 h-4" />
                  <span>Длительность: {getDuration(item.startTime, item.endTime)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <span className="text-sm font-medium">{getStatusText(item.status)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className={getRatingColor(item.rating)}>
                    {getRatingText(item.rating)}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Описание */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Описание запроса</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {item.title}
              </p>
            </div>

            {/* Ошибка (если есть) */}
            {item.error && (
              <div>
                <h4 className="font-medium text-red-900 mb-2 flex items-center space-x-2">
                  <XCircle className="w-4 h-4" />
                  <span>Информация об ошибке</span>
                </h4>
                <div className="bg-red-50 border border-red-200 p-3 rounded">
                  <p className="text-sm text-red-800">{item.error}</p>
                </div>
              </div>
            )}

            {/* Комментарий пользователя */}
            {item.comment && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Комментарий</span>
                </h4>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                  <p className="text-sm text-blue-800">{item.comment}</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {item.status === 'completed' ? (
              getDetailedResults()
            ) : (
              <div className="text-center py-8">
                <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Подробные результаты недоступны</p>
                <p className="text-sm text-gray-400 mt-1">
                  Запрос завершился с ошибкой или был отменен
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            {/* Этапы обработки */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Этапы обработки</h4>
              <div className="space-y-2">
                {getProcessingStages().map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      {stage.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {stage.status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
                      {stage.status === 'skipped' && <Clock className="w-4 h-4 text-gray-400" />}
                      <span className="text-sm">{stage.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{stage.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Технические детали */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Системная информация</h4>
              <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 space-y-1">
                <div>ID запроса: {item.id}</div>
                <div>Тип: {item.type}</div>
                <div>Статус: {item.status}</div>
                <div>Время создания: {formatDateTime(item.startTime)}</div>
                <div>Версия системы: 2.1.4</div>
                <div>Обработчик: dwh-analyzer-v3</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetails;
