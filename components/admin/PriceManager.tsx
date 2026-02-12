
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Service, ServiceType } from '../../types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';

const PriceManager: React.FC = () => {
  const { services, updateServicePrice } = useApp();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setNewPrice(service.price);
  };

  const handleSave = () => {
    if (editingService && newPrice >= 0) {
      updateServicePrice(editingService.id, newPrice);
      setEditingService(null);
    }
  };

  const handleCancel = () => {
    setEditingService(null);
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Gerenciar Preços</h2>
      <div className="space-y-4">
        {services.map(service => (
          <div key={service.id} className="p-4 bg-brand-light rounded-lg flex justify-between items-center border border-brand-primary/20">
            <div>
              <p className="font-semibold text-brand-dark">{service.name}</p>
              <p className="text-brand-text">R$ {service.price.toFixed(2)}</p>
            </div>
            <button onClick={() => handleEdit(service)} className="px-4 py-1.5 text-sm font-medium text-brand-primary bg-white border border-brand-primary rounded-full hover:bg-brand-light transition-colors">
              Editar
            </button>
          </div>
        ))}
      </div>

      {editingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm">
            <h3 className="text-xl font-bold text-brand-dark mb-4">Editar Preço de {editingService.name}</h3>
            <div className="space-y-4">
               <Input 
                label="Novo Preço (R$)"
                id="newPrice"
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                min="0"
                step="0.01"
               />
               <div className="flex space-x-2">
                 <Button onClick={handleCancel} variant="secondary">Cancelar</Button>
                 <Button onClick={handleSave}>Salvar</Button>
               </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default PriceManager;
