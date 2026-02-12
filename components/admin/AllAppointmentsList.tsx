
import React, { useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Appointment, User, AppointmentStatus } from '../../types';
import Card from '../ui/Card';
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon, WhatsAppIcon } from '../icons';
import { SALON_WHATSAPP_NUMBER } from '../../constants';

const StatusBadge: React.FC<{ status: AppointmentStatus }> = ({ status }) => {
    const baseClasses = 'px-2 py-0.5 text-xs font-semibold rounded-full';
    const statusClasses = {
        [AppointmentStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
        [AppointmentStatus.CONFIRMED]: 'bg-green-100 text-green-800',
        [AppointmentStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
}


const AdminAppointmentCard: React.FC<{ appointment: Appointment, client?: User }> = ({ appointment, client }) => {
    const { updateAppointmentStatus } = useApp();

    const formattedDate = new Date(appointment.date + 'T00:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'long'
    });
    
    const whatsappMessage = `Olá, ${client?.name?.split(' ')[0]}! Sobre o seu agendamento de ${appointment.service} para o dia ${formattedDate} às ${appointment.time}.`;
    const whatsappLink = `https://wa.me/${client?.phone}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="bg-brand-light p-4 rounded-lg shadow-sm border border-brand-primary/20 flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start">
                    <p className="font-bold text-brand-dark text-lg">{appointment.service}</p>
                    <StatusBadge status={appointment.status} />
                </div>
                <div className="flex items-center text-brand-text text-sm mt-2">
                    <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{formattedDate} às {appointment.time}</span>
                </div>
                <div className="border-t border-brand-primary/20 my-3"></div>
                <div className="flex items-center text-brand-text text-sm">
                    <UserIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="font-semibold">{client?.name || 'Cliente não encontrado'}</span>
                </div>
                <div className="flex items-center text-brand-text text-sm mt-1">
                    <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{client?.phone || 'Telefone não disponível'}</span>
                </div>
            </div>

            <div className="mt-4">
                 {appointment.status === AppointmentStatus.PENDING && (
                    <div className="flex space-x-2">
                        <button onClick={() => updateAppointmentStatus(appointment.id, AppointmentStatus.CONFIRMED)} className="flex-1 px-3 py-1.5 text-xs text-center font-semibold bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">Confirmar</button>
                        <button onClick={() => updateAppointmentStatus(appointment.id, AppointmentStatus.CANCELLED)} className="flex-1 px-3 py-1.5 text-xs text-center font-semibold bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">Recusar</button>
                    </div>
                )}
                 <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center mt-2 w-full px-3 py-1.5 text-xs text-center font-semibold bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                    <WhatsAppIcon className="h-4 w-4 mr-1.5" />
                    Enviar Mensagem
                </a>
            </div>
        </div>
    );
};


const AllAppointmentsList: React.FC = () => {
  const { appointments, getUserById } = useApp();
  
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
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Todos os Agendamentos</h2>
      {upcomingAppointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingAppointments.map(apt => (
            <AdminAppointmentCard key={apt.id} appointment={apt} client={getUserById(apt.userId)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed border-brand-primary/30 rounded-lg">
            <p className="text-brand-text">Nenhum horário agendado no momento.</p>
        </div>
      )}
    </Card>
  );
};

export default AllAppointmentsList;
