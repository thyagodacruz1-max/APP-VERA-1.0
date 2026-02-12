
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const PartnershipManager: React.FC = () => {
  const { partnerships, addPartnership, deletePartnership } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      setIsLoading(true);
      // Simulate async operation
      setTimeout(() => {
        addPartnership(name, description);
        setName('');
        setDescription('');
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Gerenciar Parcerias</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <Input
          id="partnerName"
          label="Nome do Parceiro"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Loja de Cosméticos Beleza Pura"
          required
        />
        <div>
          <label htmlFor="partnerDescription" className="block text-sm font-medium text-brand-text mb-1">
            Descrição / Contato
          </label>
          <textarea
            id="partnerDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-brand-primary/50 bg-white/50 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300"
            placeholder="Ex: 10% de desconto para clientes! Fale com @belezapura"
            required
          />
        </div>
        <Button type="submit" isLoading={isLoading}>Adicionar Parceiro</Button>
      </form>

      <div>
        <h3 className="text-lg font-semibold text-brand-dark mb-4">Parcerias Atuais</h3>
        {partnerships.length > 0 ? (
          <div className="space-y-3">
            {partnerships.map(p => (
              <div key={p.id} className="p-3 bg-brand-light rounded-lg flex justify-between items-start border border-brand-primary/20">
                <div>
                    <p className="font-semibold text-brand-dark">{p.name}</p>
                    <p className="text-brand-text text-sm">{p.description}</p>
                </div>
                <button
                  onClick={() => deletePartnership(p.id)}
                  className="text-red-500 hover:text-red-700 font-semibold text-sm flex-shrink-0 ml-4"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-text text-sm">Nenhuma parceria cadastrada.</p>
        )}
      </div>
    </Card>
  );
};

export default PartnershipManager;
