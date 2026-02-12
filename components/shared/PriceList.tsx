
import React from 'react';
import { useApp } from '../../contexts/AppContext';
import Card from '../ui/Card';

const PriceList: React.FC = () => {
  const { services } = useApp();

  return (
    <Card>
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Tabela de Preços</h2>
      <div className="space-y-3">
        {services.map(service => (
          <div key={service.id} className="flex justify-between items-center text-brand-text">
            <span>{service.name}</span>
            <span className="font-semibold text-brand-dark">R$ {service.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PriceList;
