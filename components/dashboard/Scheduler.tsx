
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ServiceType } from '../../types';
import { AVAILABLE_TIMES } from '../../constants';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { UserIcon, PhoneIcon } from '../icons';


const Scheduler: React.FC = () => {
  const { addAppointment, services } = useApp();
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [service, setService] = useState<ServiceType>(ServiceType.MANICURE);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !service || !date || !time) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    setIsSubmitting(true);
    try {
      await addAppointment({ clientName, clientPhone, service, date, time });
      setSuccessMessage(`Seu horário de ${service} para ${new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')} às ${time} foi agendado! Aguarde a confirmação.`);
      
      // Reset form
      setClientName('');
      setClientPhone('');
      setService(ServiceType.MANICURE);
      setDate('');
      setTime('');

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
        console.error("Failed to add appointment:", error);
        alert("Ocorreu um erro ao agendar. Tente novamente.");
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const getTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const todayWithOffset = new Date(today.getTime() - (offset*60*1000));
    return todayWithOffset.toISOString().split('T')[0];
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Novo Agendamento</h2>
      {successMessage && <p className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 text-sm">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          id="clientName"
          label="Seu Nome"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
          icon={<UserIcon className="h-5 w-5 text-gray-400" />}
          placeholder="Nome Completo"
        />
        <Input 
          id="clientPhone"
          label="Seu WhatsApp"
          type="tel"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          required
          icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
          placeholder="(XX) XXXXX-XXXX"
        />
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-brand-text mb-1">Serviço</label>
          <select
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value as ServiceType)}
            className="w-full px-4 py-2 rounded-lg border border-brand-primary/50 bg-white/50 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300"
          >
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-brand-text mb-1">Data</label>
          <input
            type="date"
            id="date"
            value={date}
            min={getTodayString()}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-brand-primary/50 bg-white/50 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300"
          />
        </div>
        <div>
          <span className="block text-sm font-medium text-brand-text mb-2">Horário</span>
          <div className="grid grid-cols-3 gap-2">
            {AVAILABLE_TIMES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                className={`px-2 py-2 text-sm rounded-lg border transition-colors duration-300 ${time === t ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white/50 border-brand-primary/50 hover:bg-brand-light'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="pt-2">
            <Button type="submit" isLoading={isSubmitting} disabled={!clientName || !clientPhone || !service || !date || !time || isSubmitting}>Agendar Horário</Button>
        </div>
      </form>
    </Card>
  );
};

export default Scheduler;
