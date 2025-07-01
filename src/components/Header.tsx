
import React from 'react';
import { Database, User, Bell, History, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onShowRequestTabs?: () => void;
  queueCount?: number;
  historyCount?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  onShowRequestTabs, 
  queueCount = 0, 
  historyCount = 0 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Database className="w-8 h-8 text-dwh-cyan" />
          <div>
            <h1 className="text-xl font-bold text-dwh-navy">DWH Copilot</h1>
            <p className="text-sm text-gray-600">Система аналитики данных</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Кнопки для очереди и истории запросов */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowRequestTabs}
              className="flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Очередь запросов</span>
              {queueCount > 0 && (
                <span className="bg-dwh-cyan text-white rounded-full px-2 py-0.5 text-xs">
                  {queueCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onShowRequestTabs}
              className="flex items-center space-x-2"
            >
              <History className="w-4 h-4" />
              <span>История запросов</span>
              <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                {historyCount}
              </span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <User className="w-8 h-8 p-1 bg-dwh-navy text-white rounded-full" />
            <div className="text-right">
              <p className="text-sm font-medium text-dwh-navy">Иван Иванов</p>
              <p className="text-xs text-gray-600">Аналитик</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
