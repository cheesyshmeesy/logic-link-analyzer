
import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface ProgressStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  duration?: number;
}

interface DetailedProgressProps {
  stages: ProgressStage[];
  currentStage?: string;
  overallProgress: number;
  isActive: boolean;
}

const DetailedProgress: React.FC<DetailedProgressProps> = ({
  stages,
  currentStage,
  overallProgress,
  isActive
}) => {
  const getStageIcon = (status: ProgressStage['status'], isCurrentStage: boolean) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className={`w-5 h-5 ${isCurrentStage ? 'text-blue-500' : 'text-gray-400'}`} />;
    }
  };

  const getStageTextColor = (status: ProgressStage['status'], isCurrentStage: boolean) => {
    if (status === 'completed') return 'text-green-700';
    if (status === 'failed') return 'text-red-700';
    if (status === 'processing' || isCurrentStage) return 'text-blue-700';
    return 'text-gray-500';
  };

  if (!isActive) return null;

  return (
    <div className="space-y-4">
      {/* Общий прогресс */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-dwh-navy">Общий прогресс</h4>
          <span className="text-sm font-medium text-dwh-navy">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-3" />
      </div>

      {/* Детальные этапы */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-medium text-dwh-navy mb-4">Этапы выполнения</h4>
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const isCurrentStage = stage.id === currentStage;
            const isCompleted = stage.status === 'completed';
            const isProcessing = stage.status === 'processing';
            
            return (
              <div key={stage.id} className="flex items-start space-x-4">
                {/* Индикатор этапа */}
                <div className="flex flex-col items-center">
                  {getStageIcon(stage.status, isCurrentStage)}
                  {index < stages.length - 1 && (
                    <div className={`w-px h-8 mt-2 ${
                      isCompleted ? 'bg-green-300' : 'bg-gray-300'
                    }`} />
                  )}
                </div>

                {/* Содержимое этапа */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className={`font-medium ${getStageTextColor(stage.status, isCurrentStage)}`}>
                      {stage.name}
                    </h5>
                    {stage.duration && (
                      <span className="text-xs text-gray-500">
                        {stage.duration}с
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {stage.description}
                  </p>

                  {/* Прогресс текущего этапа */}
                  {isProcessing && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Прогресс этапа</span>
                        <span className="text-blue-600 font-medium">{stage.progress}%</span>
                      </div>
                      <Progress value={stage.progress} className="h-2" />
                    </div>
                  )}

                  {/* Статус завершенного этапа */}
                  {isCompleted && (
                    <div className="text-xs text-green-600 font-medium">
                      ✓ Завершено
                    </div>
                  )}

                  {/* Ошибка этапа */}
                  {stage.status === 'failed' && (
                    <div className="text-xs text-red-600 font-medium">
                      ✗ Ошибка выполнения
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DetailedProgress;
