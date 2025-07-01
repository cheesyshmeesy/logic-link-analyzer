
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Eye, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export interface HistoryItem {
  id: string;
  type: 'mapping' | 'reverse';
  title: string;
  status: 'completed' | 'failed';
  startTime: Date;
  endTime: Date;
  rating?: 'positive' | 'negative';
  comment?: string;
  result?: any;
  error?: string;
}

interface RequestHistoryProps {
  items: HistoryItem[];
  onViewDetails?: (id: string) => void;
}

const RequestHistory: React.FC<RequestHistoryProps> = ({ items, onViewDetails }) => {
  const getStatusIcon = (status: HistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: HistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return 'Завершено';
      case 'failed':
        return 'Ошибка';
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

  const getRatingIcon = (rating?: 'positive' | 'negative') => {
    if (!rating) return <span className="text-gray-400">—</span>;
    return rating === 'positive' ? 
      <span className="text-green-600">👍</span> : 
      <span className="text-red-600">👎</span>;
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getDuration = (start: Date, end: Date) => {
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    if (duration < 60) return `${duration}с`;
    if (duration < 3600) return `${Math.floor(duration / 60)}м ${duration % 60}с`;
    return `${Math.floor(duration / 3600)}ч ${Math.floor((duration % 3600) / 60)}м`;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">История запросов пуста</p>
        <p className="text-sm text-gray-400 mt-1">
          Здесь будут отображаться все выполненные запросы
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dwh-navy">
          История запросов ({items.length})
        </h3>
        <Button variant="outline" size="sm" className="dwh-button-secondary">
          <Download className="w-4 h-4 mr-2" />
          Экспорт
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-dwh-light">
              <TableHead>Дата и время</TableHead>
              <TableHead>Тип запроса</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Длительность</TableHead>
              <TableHead>Оценка</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="text-sm">
                  {formatDateTime(item.startTime)}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getTypeText(item.type)}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {item.title}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm">{getStatusText(item.status)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {getDuration(item.startTime, item.endTime)}
                </TableCell>
                <TableCell className="text-center">
                  {getRatingIcon(item.rating)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails?.(item.id)}
                    className="text-dwh-navy hover:bg-dwh-light"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Детали
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RequestHistory;
