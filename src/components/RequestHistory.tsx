import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Download, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import RequestDetails from './RequestDetails';

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
  onRateRequest?: (id: string, rating: 'positive' | 'negative', comment?: string) => void;
}

const RequestHistory: React.FC<RequestHistoryProps> = ({ 
  items, 
  onViewDetails,
  onRateRequest 
}) => {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingType, setRatingType] = useState<'positive' | 'negative'>('positive');

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

  const handleRowClick = (item: HistoryItem) => {
    setSelectedItem(item);
    setShowDetailsDialog(true);
    onViewDetails?.(item.id);
  };

  const handleCloseDetails = () => {
    setShowDetailsDialog(false);
    setSelectedItem(null);
  };

  const handleRateClick = (e: React.MouseEvent, item: HistoryItem, rating: 'positive' | 'negative') => {
    e.stopPropagation(); // Prevent row click
    setSelectedItem(item);
    setRatingType(rating);
    setRatingComment(item.comment || '');
    
    if (rating === 'negative' || item.rating !== rating) {
      setShowRatingDialog(true);
    } else {
      // Direct positive rating or same rating
      onRateRequest?.(item.id, rating);
    }
  };

  const handleSubmitRating = () => {
    if (selectedItem) {
      onRateRequest?.(selectedItem.id, ratingType, ratingComment.trim() || undefined);
    }
    setShowRatingDialog(false);
    setRatingComment('');
    setSelectedItem(null);
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow 
                key={item.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(item)}
              >
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
                <TableCell>
                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleRateClick(e, item, 'positive')}
                      className={`p-1 h-auto ${
                        item.rating === 'positive' 
                          ? 'text-green-600 bg-green-50' 
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleRateClick(e, item, 'negative')}
                      className={`p-1 h-auto ${
                        item.rating === 'negative' 
                          ? 'text-red-600 bg-red-50' 
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Request Details Dialog */}
      <RequestDetails
        item={selectedItem}
        isOpen={showDetailsDialog}
        onClose={handleCloseDetails}
      />

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {ratingType === 'positive' ? 'Положительная оценка' : 'Что можно улучшить?'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder={
                ratingType === 'positive' 
                  ? 'Опишите, что вам понравилось (необязательно)...'
                  : 'Опишите, что было неточно или что можно улучшить...'
              }
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowRatingDialog(false)}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSubmitRating}
              >
                {ratingType === 'positive' ? 'Оценить' : 'Отправить'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestHistory;
