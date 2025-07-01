
import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Users, Activity, Wifi, WifiOff, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DetailedProgress, { ProgressStage } from './DetailedProgress';

export interface QueueItem {
  id: string;
  type: 'mapping' | 'reverse';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  title: string;
  progress: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
  errorType?: 'khd_timeout' | 'llm_timeout' | 'network_error' | 'validation_error' | 'unknown';
  estimatedWaitTime?: number;
  queuePosition?: number;
  stages?: ProgressStage[];
  currentStage?: string;
  userName?: string;
  isCurrentUser?: boolean;
}

export interface SystemLoad {
  level: 'low' | 'medium' | 'high';
  activeRequests: number;
  averageWaitTime: number;
  khdStatus: 'online' | 'slow' | 'offline';
  llmStatus: 'online' | 'slow' | 'offline';
}

interface RequestQueueProps {
  items: QueueItem[];
  systemLoad: SystemLoad;
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const RequestQueue: React.FC<RequestQueueProps> = ({ items, systemLoad, onRetry, onCancel }) => {
  const activeItems = items.filter(item => 
    item.status === 'pending' || item.status === 'processing'
  );

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

  const getLoadColor = (level: SystemLoad['level']) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
    }
  };

  const getLoadText = (level: SystemLoad['level']) => {
    switch (level) {
      case 'low': return 'Низкая';
      case 'medium': return 'Средняя';
      case 'high': return 'Высокая';
    }
  };

  const getServiceIcon = (status: 'online' | 'slow' | 'offline') => {
    switch (status) {
      case 'online': return <Wifi className="w-4 h-4 text-green-500" />;
      case 'slow': return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'offline': return <WifiOff className="w-4 h-4 text-red-500" />;
    }
  };

  const getServiceText = (status: 'online' | 'slow' | 'offline') => {
    switch (status) {
      case 'online': return 'В сети';
      case 'slow': return 'Медленно';
      case 'offline': return 'Недоступен';
    }
  };

  const getErrorMessage = (errorType?: string, error?: string) => {
    switch (errorType) {
      case 'khd_timeout':
        return 'Тайм-аут подключения к КХД. Попробуйте позже.';
      case 'llm_timeout':
        return 'Тайм-аут языковой модели. Система перегружена.';
      case 'network_error':
        return 'Ошибка сети. Проверьте подключение.';
      case 'validation_error':
        return 'Ошибка валидации данных. Проверьте входные параметры.';
      default:
        return error || 'Неизвестная ошибка';
    }
  };

  const formatDuration = (start?: Date, end?: Date) => {
    if (!start) return '';
    const endTime = end || new Date();
    const duration = Math.floor((endTime.getTime() - start.getTime()) / 1000);
    return `${duration}с`;
  };

  const formatWaitTime = (seconds: number) => {
    if (seconds < 60) return `~${seconds}с`;
    if (seconds < 3600) return `~${Math.ceil(seconds / 60)}м`;
    return `~${Math.ceil(seconds / 3600)}ч`;
  };

  return (
    <div className="space-y-4">
      {/* Системная информация */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dwh-navy">Состояние системы</h3>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-dwh-cyan" />
            <span className="text-sm font-medium">DWH Copilot</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Загруженность</span>
              <span className={`text-sm font-medium ${getLoadColor(systemLoad.level)}`}>
                {getLoadText(systemLoad.level)}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Users className="w-4 h-4" />
              <span>{systemLoad.activeRequests} активных запросов</span>
            </div>
            <div className="text-xs text-gray-500">
              Среднее время ожидания: {formatWaitTime(systemLoad.averageWaitTime)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">КХД</span>
              <div className="flex items-center space-x-1">
                {getServiceIcon(systemLoad.khdStatus)}
                <span className="text-xs">{getServiceText(systemLoad.khdStatus)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">LLM</span>
              <div className="flex items-center space-x-1">
                {getServiceIcon(systemLoad.llmStatus)}
                <span className="text-xs">{getServiceText(systemLoad.llmStatus)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Предупреждения о статусе системы */}
        {(systemLoad.khdStatus === 'offline' || systemLoad.llmStatus === 'offline') && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {systemLoad.khdStatus === 'offline' && 'КХД недоступен. '}
              {systemLoad.llmStatus === 'offline' && 'Языковая модель недоступна. '}
              Новые запросы могут быть задержаны.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Активные запросы */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold text-dwh-navy mb-4">
          Очередь запросов ({activeItems.length})
        </h3>

        {activeItems.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Очередь запросов пуста</p>
            <p className="text-sm text-gray-400 mt-1">
              Новые запросы будут отображаться здесь
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeItems.map((item, index) => (
              <div key={item.id} className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          {!item.isCurrentUser && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                              {item.userName || 'Другой пользователь'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{getStatusText(item.status)}</span>
                          {item.startTime && (
                            <span>• {formatDuration(item.startTime, item.endTime)}</span>
                          )}
                          {item.status === 'pending' && item.queuePosition && (
                            <span>• Позиция: {item.queuePosition}</span>
                          )}
                          {item.status === 'pending' && item.estimatedWaitTime && (
                            <span>• Ожидание: {formatWaitTime(item.estimatedWaitTime)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {item.status === 'failed' && onRetry && item.isCurrentUser && (
                        <button
                          onClick={() => onRetry(item.id)}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        >
                          Повторить
                        </button>
                      )}
                      {(item.status === 'pending' || item.status === 'processing') && onCancel && item.isCurrentUser && (
                        <button
                          onClick={() => onCancel(item.id)}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        >
                          Отменить
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {item.status === 'processing' && !item.stages && (
                    <div className="mt-2">
                      <Progress value={item.progress} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{item.progress}% завершено</p>
                    </div>
                  )}
                  
                  {item.status === 'failed' && (
                    <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                      <p className="text-xs text-red-600">
                        {getErrorMessage(item.errorType, item.error)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Детальный прогресс с этапами */}
                {item.stages && item.isCurrentUser && (
                  <DetailedProgress
                    stages={item.stages}
                    currentStage={item.currentStage}
                    overallProgress={item.progress}
                    isActive={item.status === 'processing'}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestQueue;
