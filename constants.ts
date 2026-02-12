
import { Service, ServiceType } from './types';

export const INITIAL_SERVICES: Service[] = [
  { id: ServiceType.MANICURE, name: 'Manicure', duration: 45, price: 30 },
  { id: ServiceType.PEDICURE, name: 'Pedicure', duration: 60, price: 40 },
  { id: ServiceType.COMBO, name: 'Manicure + Pedicure', duration: 105, price: 65 },
];

export const AVAILABLE_TIMES = [
  '09:00', '10:00', '11:00', '12:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00'
];
