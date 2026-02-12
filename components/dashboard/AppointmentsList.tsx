
import React, { useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Appointment, AppointmentStatus } from '../../types';
import Card from '../ui/Card';
import { CalendarIcon, ClockIcon, UserIcon } from '../icons';

const StatusBadge: React.FC<{ status: AppointmentStatus }> = ({ status }) => {
    const baseClasses = 'px-2 py-0.5 text-xs font-semibold rounded-full';
    const statusClasses = {
        [AppointmentStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
        [AppointmentStatus.CONFIRMED]: 'bg-green-100 text-green-800',
        [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
}

const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
    const { cancelAppointment } = useApp();
    const formattedDate = new Date(appointment.date + 'T00:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'long'
    });
    
    const handleCancel = () => {
        if (window.confirm("Tem certeza que deseja cancelar este agendamento?")) {
            cancelAppointment(appointment.id);
        }
    };

    return (
        <div className="bg-brand-light p-4 rounded-lg shadow-sm border border-brand-primary/20 flex flex-col justify-between items-start space-y-3">
            <div>
                <div className="flex w-full justify-between items-start">
                    <p className="font-bold text-brand-dark text-lg">{appointment.service}</p>
                    <StatusBadge status={appointment.status} />
                </div>
                <div className="flex items-center text-brand-text text-sm mt-2">
                    <UserIcon className="h-4 w-4 mr-2" />
                    <span>{appointment.clientName}</span>
                </div>
                <div className="flex items-center text-brand-text text-sm mt-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center text-brand-text text-sm mt-1">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{appointment.time}</span>
                </div>
            </div>
            <div className="w-full pt-2">
                <button
                    onClick={handleCancel}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600 transition-colors duration-300 shadow-md"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};


const AppointmentsList: React.FC = () => {
  const { appointments, isLoading } = useApp();

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });
  }, [appointments]);
  
  const upcomingAppointments = sortedAppointments.filter(apt => new Date(`${apt.date}T${apt.time}`) >= new Date());

  return (
    <Card>
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Meus Agendamentos</h2>
      <p className="text-sm text-brand-text -mt-4 mb-6">Os agendamentos são salvos apenas neste navegador.</p>
      
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-brand-text">Carregando agendamentos...</p>
        </div>
      ) : upcomingAppointments.length > 0 ? (
        <div className="space-y-4">
          {upcomingAppointments.map(apt => (
            <AppointmentCard key={apt.id} appointment={apt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed border-brand-primary/30 rounded-lg">
            <p className="text-brand-text">Você não tem horários agendados.</p>
            <p className="text-sm text-gray-500 mt-1">Use o formulário ao lado para agendar seu primeiro horário!</p>
        </div>
      )}
    </Card>
  );
};

export default AppointmentsList;
