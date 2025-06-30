
import React, { useState } from 'react';
import { Database, Download, Plus, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LogicalModel = () => {
  const [entities, setEntities] = useState([
    { id: 1, name: 'Customer', description: 'Клиенты системы', type: 'Основная' },
    { id: 2, name: 'Product', description: 'Товары и услуги', type: 'Основная' },
    { id: 3, name: 'Order', description: 'Заказы клиентов', type: 'Транзакционная' },
  ]);

  const [attributes, setAttributes] = useState([
    { id: 1, entity: 'Customer', name: 'customer_id', type: 'INTEGER', description: 'Уникальный идентификатор' },
    { id: 2, entity: 'Customer', name: 'customer_name', type: 'VARCHAR(100)', description: 'Наименование клиента' },
    { id: 3, entity: 'Product', name: 'product_id', type: 'INTEGER', description: 'Уникальный идентификатор' },
    { id: 4, entity: 'Product', name: 'product_name', type: 'VARCHAR(200)', description: 'Наименование товара' },
  ]);

  const [relationships, setRelationships] = useState([
    { id: 1, from: 'Customer', to: 'Order', type: 'One-to-Many', description: 'Один клиент может иметь много заказов' },
    { id: 2, from: 'Product', to: 'Order', type: 'Many-to-Many', description: 'Товары связаны с заказами через позиции' },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="dwh-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-dwh-navy">Построение логической модели данных</h2>
          <div className="flex space-x-2">
            <Button className="dwh-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Добавить сущность
            </Button>
            <Button className="dwh-button-secondary">
              <Download className="w-4 h-4 mr-2" />
              Экспорт SQL/PNG
            </Button>
          </div>
        </div>

        {/* Visual diagram area */}
        <div className="bg-dwh-light/50 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
          <div className="text-center text-gray-500">
            <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Визуальный конструктор ER-диаграмм</p>
            <p className="text-sm">Перетащите сущности для создания диаграммы</p>
          </div>
        </div>
      </div>

      {/* Entities Table */}
      <div className="dwh-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dwh-navy">Сущности</h3>
          <Button size="sm" className="dwh-button-primary">
            <Plus className="w-4 h-4 mr-1" />
            Добавить
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-dwh-navy">Имя</th>
                <th className="text-left py-3 px-4 font-medium text-dwh-navy">Описание</th>
                <th className="text-left py-3 px-4 font-medium text-dwh-navy">Тип</th>
                <th className="text-left py-3 px-4 font-medium text-dwh-navy">Действия</th>
              </tr>
            </thead>
            <tbody>
              {entities.map((entity) => (
                <tr key={entity.id} className="border-b border-gray-100 hover:bg-dwh-light/30">
                  <td className="py-3 px-4 font-medium text-dwh-navy">{entity.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{entity.description}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-dwh-cyan/20 text-dwh-navy rounded-full text-xs">
                      {entity.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" className="text-dwh-navy hover:text-dwh-cyan">
                      Редактировать
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attributes Table */}
      <div className="dwh-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dwh-navy">Атрибуты</h3>
          <Button size="sm" className="dwh-button-primary">
            <Plus className="w-4 h-4 mr-1" />
            Добавить
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-dwh-navy">Сущность</th>
                <th className="text-left py-3 px-4 font-medium text-dwh-navy">Имя</th>
                <th className="text-left py-3 px-4 font-medium text-dwh-navy">Тип данных</th>
                <th className="text-left py-3 px-4 font-medium text-dwh-navy">Описание</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={attr.id} className="border-b border-gray-100 hover:bg-dwh-light/30">
                  <td className="py-3 px-4 font-medium text-dwh-navy">{attr.entity}</td>
                  <td className="py-3 px-4 font-mono text-sm text-gray-700">{attr.name}</td>
                  <td className="py-3 px-4 font-mono text-sm text-dwh-cyan">{attr.type}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{attr.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Relationships Table */}
      <div className="dwh-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-dwh-navy">Связи</h3>
          <Button size="sm" className="dwh-button-primary">
            <Link className="w-4 h-4 mr-1" />
            Добавить связь
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-dwh-navy">От</th>
                <th className="text-left py-3 px-4 font-medium text-dwh-navy">К</th>
                <th className="text-left py-3 px-4 font-medium text-dwh-navy">Тип связи</th>
                <th className="text-left py-3 px-4 font-medium text-dwh-navy">Описание</th>
              </tr>
            </thead>
            <tbody>
              {relationships.map((rel) => (
                <tr key={rel.id} className="border-b border-gray-100 hover:bg-dwh-light/30">
                  <td className="py-3 px-4 font-medium text-dwh-navy">{rel.from}</td>
                  <td className="py-3 px-4 font-medium text-dwh-navy">{rel.to}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-dwh-navy/10 text-dwh-navy rounded-full text-xs">
                      {rel.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{rel.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogicalModel;
