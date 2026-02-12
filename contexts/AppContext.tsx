
import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { Appointment, AppointmentStatus, Service, User, Announcement, Partnership } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_SERVICES } from '../constants';
import useAuth from '../hooks/useAuth';

interface AppContextType {
  // Auth
  currentUser: User | null;
  logout: () => void;
  loginAdmin: (code: string) => Promise<User | null>;
  getUserById: (userId: string) => User | undefined;
  register: (data: any) => Promise<User | null>;

  // Data
  appointments: Appointment[];
  services: Service[];
  announcements: Announcement[];
  partnerships: Partnership[];
  
  // Actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'userId'>) => void;
  cancelAppointment: (appointmentId: string) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  updateServicePrice: (serviceId: string, newPrice: number) => void;
  addAnnouncement: (content: string) => void;
  deleteAnnouncement: (announcementId: string) => void;
  addPartnership: (name: string, description: string) => void;
  deletePartnership: (partnershipId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('veramagrin-appointments', []);
  const [services, setServices] = useLocalStorage<Service[]>('veramagrin-services', INITIAL_SERVICES);
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('veramagrin-announcements', []);
  const [partnerships, setPartnerships] = useLocalStorage<Partnership[]>('veramagrin-partnerships', []);

  const addAppointment = useCallback((appointmentData: Omit<Appointment, 'id' | 'status' | 'userId'>) => {
      const newAppointment: Appointment = {
          ...appointmentData,
          id: `apt_${Date.now()}`,
          status: AppointmentStatus.PENDING,
          userId: auth.user?.id
      };
      setAppointments(prev => [...prev, newAppointment]);
  }, [setAppointments, auth.user]);

  const cancelAppointment = useCallback((appointmentId: string) => {
    // For clients, this just removes it. For admins, it could be a status change.
    // Sticking to removal for client-side simplicity.
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  }, [setAppointments]);
  
  const updateAppointmentStatus = useCallback((appointmentId: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(apt => apt.id === appointmentId ? { ...apt, status } : apt));
  }, [setAppointments]);

  const updateServicePrice = useCallback((serviceId: string, newPrice: number) => {
    setServices(prev => prev.map(srv => srv.id === serviceId ? { ...srv, price: newPrice } : srv));
  }, [setServices]);

  const addAnnouncement = useCallback((content: string) => {
      const newAnnouncement: Announcement = { id: `an_${Date.now()}`, content };
      setAnnouncements(prev => [newAnnouncement, ...prev]); // Add to the top
  }, [setAnnouncements]);

  const deleteAnnouncement = useCallback((announcementId: string) => {
    setAnnouncements(prev => prev.filter(an => an.id !== announcementId));
  }, [setAnnouncements]);
  
  const addPartnership = useCallback((name: string, description: string) => {
      const newPartnership: Partnership = { id: `p_${Date.now()}`, name, description };
      setPartnerships(prev => [...prev, newPartnership]);
  }, [setPartnerships]);

  const deletePartnership = useCallback((partnershipId: string) => {
    setPartnerships(prev => prev.filter(p => p.id !== partnershipId));
  }, [setPartnerships]);

  // FIX: Added a dummy register function to satisfy the call in the unused Register.tsx component.
  // This resolves a compilation error without implementing a deprecated feature.
  const register = useCallback(async (data: any): Promise<User | null> => {
    console.warn("Register function is not implemented as user registration appears to be a deprecated feature.");
    return null;
  }, []);


  const value = useMemo(() => ({
    currentUser: auth.user,
    logout: auth.logout,
    loginAdmin: auth.loginAdmin,
    getUserById: auth.getUserById,
    register,
    appointments,
    services,
    announcements,
    partnerships,
    addAppointment,
    cancelAppointment,
    updateAppointmentStatus,
    updateServicePrice,
    addAnnouncement,
    deleteAnnouncement,
    addPartnership,
    deletePartnership,
  }), [auth, register, appointments, services, announcements, partnerships, addAppointment, cancelAppointment, updateAppointmentStatus, updateServicePrice, addAnnouncement, deleteAnnouncement, addPartnership, deletePartnership]);

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
