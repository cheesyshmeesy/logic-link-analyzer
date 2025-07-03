
import React from 'react';
import { Database, User, Bell, History, Clock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Выход из аккаунта');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

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
          {/* Кнопки без счетчиков */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowRequestTabs}
              className="flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Очередь запросов</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onShowRequestTabs}
              className="flex items-center space-x-2"
            >
              <History className="w-4 h-4" />
              <span>История запросов</span>
            </Button>
          </div>
          
          {/* Профиль пользователя с выпадающим меню */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-dwh-light">
                <User className="w-8 h-8 p-1 bg-dwh-navy text-white rounded-full" />
                <div className="text-right">
                  <p className="text-sm font-medium text-dwh-navy">Иван Иванов</p>
                  <p className="text-xs text-gray-600">Аналитик</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Профиль</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 w-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
