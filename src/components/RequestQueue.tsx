
import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface QueueItem {
  id: string;
  type: 'mapping' | 'reverse';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  title: string;
  progress: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

interface RequestQueueProps {
  items: QueueItem[];
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const RequestQueue: React.FC<RequestQueueProps> = ({ items, onRetry, onCancel }) => {
  if (items.length === 0) return null;

  const getStatusIcon = (status: QueueItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: QueueItem['status']) => {
    switch (status) {
      case 'pending':
        return 'В очереди';
      case 'processing':
        return 'Выполняется';
      case 'completed':
        return 'Завершено';
      case 'failed':
        return 'Ошибка';
    }
  };

  const formatDuration = (start?: Date, end?: Date) => {
    if (!start) return '';
    const endTime = end || new Date();
    const duration = Math.floor((endTime.getTime() - start.getTime()) / 1000);
    return `${duration}с`;
  };

  return (
    <div className="dwh-card mb-6">
      <h3 className="text-lg font-semibold text-dwh-navy mb-4">Очередь запросов</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                {getStatusIcon(item.status)}
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500">
                    {getStatusText(item.status)}
                    {item.startTime && ` • ${formatDuration(item.startTime, item.endTime)}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {item.status === 'failed' && onRetry && (
                  <button
                    onClick={() => onRetry(item.id)}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    Повторить
                  </button>
                )}
                {(item.status === 'pending' || item.status === 'processing') && onCancel && (
                  <button
                    onClick={() => onCancel(item.id)}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                  >
                    Отменить
                  </button>
                )}
              </div>
            </div>
            
            {item.status === 'processing' && (
              <div className="mt-2">
                <Progress value={item.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">{item.progress}% завершено</p>
              </div>
            )}
            
            {item.status === 'failed' && item.error && (
              <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                <p className="text-xs text-red-600">{item.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestQueue;
