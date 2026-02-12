
import { Appointment, Service, Announcement, Partnership, AppointmentStatus } from '../types';
import { INITIAL_SERVICES } from '../constants';

const API_LATENCY = 300; // ms

// Helper to interact with localStorage, acting as our mock database
const db = {
  get: <T,>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },
  set: <T,>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },
};

// --- Initialize DB with default values if it's empty ---
const initializeDatabase = () => {
    if (db.get('veramagrin-services', null) === null) {
        db.set<Service[]>('veramagrin-services', INITIAL_SERVICES);
    }
    if (db.get('veramagrin-appointments', null) === null) {
        db.set<Appointment[]>('veramagrin-appointments', []);
    }
    if (db.get('veramagrin-announcements', null) === null) {
        db.set<Announcement[]>('veramagrin-announcements', []);
    }
    if (db.get('veramagrin-partnerships', null) === null) {
        db.set<Partnership[]>('veramagrin-partnerships', []);
    }
};
initializeDatabase();


// --- API Functions ---

// Services
export const getServices = async (): Promise<Service[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(db.get<Service[]>('veramagrin-services', []));
    }, API_LATENCY);
  });
};

export const updateServicePrice = async (serviceId: string, newPrice: number): Promise<Service> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const services = db.get<Service[]>('veramagrin-services', []);
            let updatedService: Service | undefined;
            const updatedServices = services.map(s => {
                if (s.id === serviceId) {
                    updatedService = { ...s, price: newPrice };
                    return updatedService;
                }
                return s;
            });

            if (updatedService) {
                db.set('veramagrin-services', updatedServices);
                resolve(updatedService);
            } else {
                reject(new Error('Serviço não encontrado'));
            }
        }, API_LATENCY);
    });
};

// Appointments
export const getAppointments = async (): Promise<Appointment[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(db.get<Appointment[]>('veramagrin-appointments', []));
    }, API_LATENCY);
  });
};

export const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const appointments = db.get<Appointment[]>('veramagrin-appointments', []);
            const newAppointment: Appointment = {
                ...appointmentData,
                id: `apt_${Date.now()}`,
                status: AppointmentStatus.PENDING,
            };
            const updatedAppointments = [...appointments, newAppointment];
            db.set('veramagrin-appointments', updatedAppointments);
            resolve(newAppointment);
        }, API_LATENCY);
    });
};

export const cancelAppointment = async (appointmentId: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const appointments = db.get<Appointment[]>('veramagrin-appointments', []);
            const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
            db.set('veramagrin-appointments', updatedAppointments);
            resolve(appointmentId);
        }, API_LATENCY);
    });
};

export const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus): Promise<Appointment> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const appointments = db.get<Appointment[]>('veramagrin-appointments', []);
            let updatedAppointment: Appointment | undefined;
            const updatedAppointments = appointments.map(apt => {
                if (apt.id === appointmentId) {
                    updatedAppointment = { ...apt, status };
                    return updatedAppointment;
                }
                return apt;
            });
            if (updatedAppointment) {
                db.set('veramagrin-appointments', updatedAppointments);
                resolve(updatedAppointment);
            } else {
                reject(new Error('Agendamento não encontrado'));
            }
        }, API_LATENCY);
    });
};

// Announcements
export const getAnnouncements = async (): Promise<Announcement[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(db.get<Announcement[]>('veramagrin-announcements', []));
    }, API_LATENCY);
  });
};

export const addAnnouncement = async (content: string): Promise<Announcement> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const announcements = db.get<Announcement[]>('veramagrin-announcements', []);
            const newAnnouncement: Announcement = { id: `an_${Date.now()}`, content };
            const updatedAnnouncements = [newAnnouncement, ...announcements];
            db.set('veramagrin-announcements', updatedAnnouncements);
            resolve(newAnnouncement);
        }, API_LATENCY);
    });
};

export const deleteAnnouncement = async (announcementId: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const announcements = db.get<Announcement[]>('veramagrin-announcements', []);
            const updatedAnnouncements = announcements.filter(an => an.id !== announcementId);
            db.set('veramagrin-announcements', updatedAnnouncements);
            resolve(announcementId);
        }, API_LATENCY);
    });
};

// Partnerships
export const getPartnerships = async (): Promise<Partnership[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(db.get<Partnership[]>('veramagrin-partnerships', []));
        }, API_LATENCY);
    });
};

export const addPartnership = async (name: string, description: string): Promise<Partnership> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const partnerships = db.get<Partnership[]>('veramagrin-partnerships', []);
            const newPartnership: Partnership = { id: `p_${Date.now()}`, name, description };
            const updatedPartnerships = [...partnerships, newPartnership];
            db.set('veramagrin-partnerships', updatedPartnerships);
            resolve(newPartnership);
        }, API_LATENCY);
    });
};

export const deletePartnership = async (partnershipId: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const partnerships = db.get<Partnership[]>('veramagrin-partnerships', []);
            const updatedPartnerships = partnerships.filter(p => p.id !== partnershipId);
            db.set('veramagrin-partnerships', updatedPartnerships);
            resolve(partnershipId);
        }, API_LATENCY);
    });
};
