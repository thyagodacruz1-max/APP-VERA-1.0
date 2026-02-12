
import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { Appointment, AppointmentStatus, Service, User, Announcement, Partnership } from '../types';
import useAuth from '../hooks/useAuth';
import * as api from '../lib/api';

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
  
  // State
  isLoading: boolean;
  error: string | null;

  // Actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'userId'>) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => Promise<void>;
  updateServicePrice: (serviceId: string, newPrice: number) => Promise<void>;
  addAnnouncement: (content: string) => Promise<void>;
  deleteAnnouncement: (announcementId: string) => Promise<void>;
  addPartnership: (name: string, description: string) => Promise<void>;
  deletePartnership: (partnershipId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [
          servicesData, 
          appointmentsData,
          announcementsData,
          partnershipsData
        ] = await Promise.all([
          api.getServices(),
          api.getAppointments(),
          api.getAnnouncements(),
          api.getPartnerships(),
        ]);
        setServices(servicesData);
        setAppointments(appointmentsData);
        setAnnouncements(announcementsData);
        setPartnerships(partnershipsData);
      } catch (err) {
        setError("Não foi possível carregar os dados. Tente recarregar a página.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addAppointmentCb = useCallback(async (appointmentData: Omit<Appointment, 'id' | 'status' | 'userId'>) => {
      const dataWithUser = { ...appointmentData, userId: auth.user?.id };
      const newAppointment = await api.addAppointment(dataWithUser);
      setAppointments(prev => [...prev, newAppointment]);
  }, [auth.user]);

  const cancelAppointmentCb = useCallback(async (appointmentId: string) => {
    await api.cancelAppointment(appointmentId);
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  }, []);
  
  const updateAppointmentStatusCb = useCallback(async (appointmentId: string, status: AppointmentStatus) => {
    const updatedAppointment = await api.updateAppointmentStatus(appointmentId, status);
    setAppointments(prev => prev.map(apt => apt.id === appointmentId ? updatedAppointment : apt));
  }, []);

  const updateServicePriceCb = useCallback(async (serviceId: string, newPrice: number) => {
    const updatedService = await api.updateServicePrice(serviceId, newPrice);
    setServices(prev => prev.map(srv => srv.id === serviceId ? updatedService : srv));
  }, []);

  const addAnnouncementCb = useCallback(async (content: string) => {
      const newAnnouncement = await api.addAnnouncement(content);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
  }, []);

  const deleteAnnouncementCb = useCallback(async (announcementId: string) => {
    await api.deleteAnnouncement(announcementId);
    setAnnouncements(prev => prev.filter(an => an.id !== announcementId));
  }, []);
  
  const addPartnershipCb = useCallback(async (name: string, description: string) => {
      const newPartnership = await api.addPartnership(name, description);
      setPartnerships(prev => [...prev, newPartnership]);
  }, []);

  const deletePartnershipCb = useCallback(async (partnershipId: string) => {
    await api.deletePartnership(partnershipId);
    setPartnerships(prev => prev.filter(p => p.id !== partnershipId));
  }, []);

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
    isLoading,
    error,
    addAppointment: addAppointmentCb,
    cancelAppointment: cancelAppointmentCb,
    updateAppointmentStatus: updateAppointmentStatusCb,
    updateServicePrice: updateServicePriceCb,
    addAnnouncement: addAnnouncementCb,
    deleteAnnouncement: deleteAnnouncementCb,
    addPartnership: addPartnershipCb,
    deletePartnership: deletePartnershipCb,
  }), [
    auth, register, appointments, services, announcements, partnerships, isLoading, error,
    addAppointmentCb, cancelAppointmentCb, updateAppointmentStatusCb, updateServicePriceCb, 
    addAnnouncementCb, deleteAnnouncementCb, addPartnershipCb, deletePartnershipCb
  ]);

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
