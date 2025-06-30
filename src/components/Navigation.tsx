
import React from 'react';
import { BarChart3, Search, GitBranch } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    {
      id: 'mapping',
      label: 'Атрибутный маппинг',
      icon: BarChart3,
    },
    {
      id: 'reverse',
      label: 'Реверс-инжиниринг',
      icon: Search,
    },
    {
      id: 'model',
      label: 'Построение ЛМД',
      icon: GitBranch,
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'border-dwh-cyan text-dwh-navy bg-dwh-light/50'
                    : 'border-transparent text-gray-600 hover:text-dwh-navy hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
