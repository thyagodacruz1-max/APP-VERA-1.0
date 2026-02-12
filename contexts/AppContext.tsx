
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { User, Appointment, AppointmentStatus, Service, ServiceType, Announcement } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { AuthCredentials, RegisterCredentials } from '../hooks/useAuth';
import useAuth from '../hooks/useAuth';
import { INITIAL_SERVICES } from '../constants';

type View = 'login' | 'register' | 'dashboard';

interface AppContextType {
  user: User | null;
  currentView: View;
  appointments: Appointment[];
  services: Service[];
  announcements: Announcement[];
  login: (credentials: AuthCredentials) => Promise<User | null>;
  register: (credentials: RegisterCredentials) => Promise<User | null>;
  loginAdmin: (code: string) => Promise<User | null>;
  logout: () => void;
  setCurrentView: (view: View) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'userId' | 'status'>) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  getAppointmentsForUser: (userId: string) => Appointment[];
  getUserById: (userId: string) => User | undefined;
  updateServicePrice: (serviceId: ServiceType, newPrice: number) => void;
  addAnnouncement: (content: string) => void;
  deleteAnnouncement: (announcementId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login, register, logout, setUser, loginAdmin, getUserById } = useAuth();
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('veramagrin-appointments', []);
  const [services, setServices] = useLocalStorage<Service[]>('veramagrin-services', INITIAL_SERVICES);
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('veramagrin-announcements', []);
  const [currentView, setCurrentView] = useState<View>('login');
  
  const handleLogin = useCallback(async (credentials: AuthCredentials) => {
    const loggedInUser = await login(credentials);
    if (loggedInUser) {
      setUser(loggedInUser);
      setCurrentView('dashboard');
    }
    return loggedInUser;
  }, [login, setUser]);

  const handleAdminLogin = useCallback(async (code: string) => {
    const adminUser = await loginAdmin(code);
    if (adminUser) {
      setUser(adminUser);
      setCurrentView('dashboard');
    }
    return adminUser;
  }, [loginAdmin, setUser]);

  const handleRegister = useCallback(async (credentials: RegisterCredentials) => {
    const registeredUser = await register(credentials);
    if (registeredUser) {
      setUser(registeredUser);
      setCurrentView('dashboard');
    }
    return registeredUser;
  }, [register, setUser]);
  
  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
    setCurrentView('login');
  }, [logout, setUser]);

  const addAppointment = useCallback((appointmentData: Omit<Appointment, 'id' | 'userId' | 'status'>) => {
      if (!user || user.isAdmin) return;
      const newAppointment: Appointment = {
          ...appointmentData,
          id: `apt_${Date.now()}`,
          userId: user.id,
          status: AppointmentStatus.PENDING,
      };
      setAppointments(prev => [...prev, newAppointment]);
  }, [user, setAppointments]);
  
  const updateAppointmentStatus = useCallback((appointmentId: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(apt => apt.id === appointmentId ? { ...apt, status } : apt));
  }, [setAppointments]);

  const getAppointmentsForUser = useCallback((userId: string) => {
      return appointments.filter(apt => apt.userId === userId);
  }, [appointments]);

  const updateServicePrice = useCallback((serviceId: ServiceType, newPrice: number) => {
    setServices(prev => prev.map(srv => srv.id === serviceId ? { ...srv, price: newPrice } : srv));
  }, [setServices]);

  const addAnnouncement = useCallback((content: string) => {
    const newAnnouncement: Announcement = {
      id: `an_${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  }, [setAnnouncements]);

  const deleteAnnouncement = useCallback((announcementId: string) => {
    setAnnouncements(prev => prev.filter(an => an.id !== announcementId));
  }, [setAnnouncements]);

  const value = useMemo(() => ({
    user,
    currentView,
    appointments,
    services,
    announcements,
    login: handleLogin,
    loginAdmin: handleAdminLogin,
    register: handleRegister,
    logout: handleLogout,
    setCurrentView,
    addAppointment,
    getAppointmentsForUser,
    getUserById,
    updateAppointmentStatus,
    updateServicePrice,
    addAnnouncement,
    deleteAnnouncement,
  }), [user, currentView, appointments, services, announcements, handleLogin, handleAdminLogin, handleRegister, handleLogout, addAppointment, getAppointmentsForUser, getUserById, updateAppointmentStatus, updateServicePrice, addAnnouncement, deleteAnnouncement]);

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
