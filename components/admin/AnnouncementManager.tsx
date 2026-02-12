
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const AnnouncementManager: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement } = useApp();
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnnouncement.trim()) {
      setIsLoading(true);
      // Simulate async operation
      setTimeout(() => {
        addAnnouncement(newAnnouncement);
        setNewAnnouncement('');
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Gerenciar Anúncios</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        <div>
          <label htmlFor="announcement" className="block text-sm font-medium text-brand-text mb-1">
            Novo Anúncio
          </label>
          <textarea
            id="announcement"
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-brand-primary/50 bg-white/50 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300"
            placeholder="Ex: Estaremos fechados no próximo feriado."
          />
        </div>
        <Button type="submit" isLoading={isLoading}>Adicionar Anúncio</Button>
      </form>

      <div>
        <h3 className="text-lg font-semibold text-brand-dark mb-4">Anúncios Atuais</h3>
        {announcements.length > 0 ? (
          <div className="space-y-3">
            {announcements.map(an => (
              <div key={an.id} className="p-3 bg-brand-light rounded-lg flex justify-between items-center border border-brand-primary/20">
                <p className="text-brand-text text-sm">{an.content}</p>
                <button
                  onClick={() => deleteAnnouncement(an.id)}
                  className="text-red-500 hover:text-red-700 font-semibold text-sm"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-text text-sm">Nenhum anúncio no momento.</p>
        )}
      </div>
    </Card>
  );
};

export default AnnouncementManager;
