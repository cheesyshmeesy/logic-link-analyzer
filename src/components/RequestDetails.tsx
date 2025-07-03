
import React from 'react';
import { CheckCircle, XCircle, Clock, User, Calendar, Timer, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {getStatusIcon(item.status)}
            <span>{item.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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

          {/* Результаты (если есть) */}
          {item.result && item.status === 'completed' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Результаты</h4>
              <div className="bg-green-50 border border-green-200 p-3 rounded">
                <p className="text-sm text-green-800">
                  Запрос выполнен успешно. Результаты обработаны и сохранены.
                </p>
                {item.type === 'mapping' && (
                  <p className="text-xs text-green-600 mt-1">
                    Создано {Math.floor(Math.random() * 20) + 5} связей маппинга
                  </p>
                )}
                {item.type === 'reverse' && (
                  <p className="text-xs text-green-600 mt-1">
                    Проанализировано {Math.floor(Math.random() * 15) + 8} таблиц
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Технические детали */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Технические детали</h4>
            <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 space-y-1">
              <div>ID запроса: {item.id}</div>
              <div>Тип: {item.type}</div>
              <div>Статус: {item.status}</div>
              <div>Время создания: {formatDateTime(item.startTime)}</div>
            </div>
          </div>
        </div>

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
