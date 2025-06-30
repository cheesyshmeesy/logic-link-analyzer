
import React from 'react';
import { Database, User, Bell } from 'lucide-react';

const Header = () => {
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
          <div className="flex items-center space-x-2 bg-dwh-light px-3 py-2 rounded-md">
            <Bell className="w-4 h-4 text-dwh-navy" />
            <span className="text-sm font-medium text-dwh-navy">Очередь запросов: 1</span>
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
