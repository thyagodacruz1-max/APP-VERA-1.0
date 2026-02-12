
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Appointment, AppointmentStatus, Service, ServiceType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_SERVICES } from '../constants';

interface AppContextType {
  appointments: Appointment[];
  services: Service[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  cancelAppointment: (appointmentId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('veramagrin-appointments', []);
  const [services] = useLocalStorage<Service[]>('veramagrin-services', INITIAL_SERVICES);

  const addAppointment = useCallback((appointmentData: Omit<Appointment, 'id' | 'status'>) => {
      const newAppointment: Appointment = {
          ...appointmentData,
          id: `apt_${Date.now()}`,
          status: AppointmentStatus.PENDING,
      };
      setAppointments(prev => [...prev, newAppointment]);
  }, [setAppointments]);

  const cancelAppointment = useCallback((appointmentId: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  }, [setAppointments]);

  const value = useMemo(() => ({
    appointments,
    services,
    addAppointment,
    cancelAppointment,
  }), [appointments, services, addAppointment, cancelAppointment]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};