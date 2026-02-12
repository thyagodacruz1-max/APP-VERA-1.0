
import React from 'react';
import { useApp } from '../../contexts/AppContext';
import Card from '../ui/Card';

const PartnershipsList: React.FC = () => {
  const { partnerships } = useApp();

  if (partnerships.length === 0) {
    return null;
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Nossas Parcerias</h2>
      <div className="space-y-4">
        {partnerships.map(p => (
          <div key={p.id} className="p-3 bg-brand-light rounded-lg border border-brand-primary/20">
             <h3 className="font-semibold text-brand-dark">{p.name}</h3>
             <p className="text-brand-text text-sm mt-1">{p.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PartnershipsList;
