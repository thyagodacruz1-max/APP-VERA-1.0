
import React, { useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Appointment, User, AppointmentStatus } from '../../types';
import Card from '../ui/Card';
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon } from '../icons';

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
    
    const clientPhone = client?.phone || appointment.clientPhone;
    const clientName = client?.name || appointment.clientName;

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
                    <span className="font-semibold">{clientName || 'Cliente não encontrado'}</span>
                </div>
                <div className="flex items-center text-brand-text text-sm mt-1">
                    <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{clientPhone || 'Telefone não disponível'}</span>
                </div>
            </div>

            {appointment.status === AppointmentStatus.PENDING && (
                <div className="mt-4 flex space-x-2">
                    <button onClick={() => updateAppointmentStatus(appointment.id, AppointmentStatus.CONFIRMED)} className="flex-1 px-3 py-1.5 text-xs text-center font-semibold bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">Confirmar</button>
                    <button onClick={() => updateAppointmentStatus(appointment.id, AppointmentStatus.CANCELLED)} className="flex-1 px-3 py-1.5 text-xs text-center font-semibold bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">Recusar</button>
                </div>
            )}
        </div>
    );
};


const AllAppointmentsList: React.FC = () => {
  const { appointments, getUserById, isLoading } = useApp();
  const appointmentsCountRef = useRef(appointments.length);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Don't play sound on initial load, only on subsequent updates
    if (isInitialMount.current) {
      if (appointments.length > 0) {
        isInitialMount.current = false;
        appointmentsCountRef.current = appointments.length;
      }
      return;
    }

    if (appointments.length > appointmentsCountRef.current) {
      const latestAppointment = appointments[appointments.length - 1];
      
      if (latestAppointment && latestAppointment.status === AppointmentStatus.PENDING) {
        const audio = new Audio('https://cdn.freesound.org/previews/536/536442_11861313-lq.mp3');
        audio.play().catch(error => {
          console.error("A reprodução automática do áudio falhou. Interaja com a página para ativá-la.", error);
        });
      }
    }
    appointmentsCountRef.current = appointments.length;
  }, [appointments]);
  
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
      {isLoading ? (
        <div className="text-center py-10">
            <p className="text-brand-text">Carregando agendamentos...</p>
        </div>
      ) : upcomingAppointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingAppointments.map(apt => (
            <AdminAppointmentCard key={apt.id} appointment={apt} client={apt.userId ? getUserById(apt.userId) : undefined} />
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
