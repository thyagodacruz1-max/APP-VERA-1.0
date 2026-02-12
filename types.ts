
export enum ServiceType {
  MANICURE = 'Manicure',
  PEDICURE = 'Pedicure',
  COMBO = 'Manicure + Pedicure',
}

export enum AppointmentStatus {
  PENDING = 'Pendente',
  CONFIRMED = 'Confirmado',
  CANCELLED = 'Recusado',
}

export interface Service {
  id: ServiceType;
  name: string;
  duration: number;
  price: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  service: ServiceType;
  date: string;
  time: string;
  status: AppointmentStatus;
  userId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
}

export interface Announcement {
  id: string;
  content: string;
}

export interface Partnership {
  id: string;
  name: string;
  description: string;
}
