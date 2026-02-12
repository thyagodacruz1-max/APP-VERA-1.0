
import React from 'react';
import Header from '../layout/Header';
import Scheduler from './Scheduler';
import AppointmentsList from './AppointmentsList';
import PriceList from '../shared/PriceList';
import Announcements from '../shared/Announcements';
import PartnershipsList from '../shared/PartnershipsList';

interface DashboardProps {
  onGoToAdminLogin: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onGoToAdminLogin }) => {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg mx-auto mb-8">
            <Announcements />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Scheduler />
            <PriceList />
            <PartnershipsList />
          </div>
          <div className="lg:col-span-3">
            <AppointmentsList />
          </div>
        </div>
        <div className="text-center mt-12 py-4">
            <button onClick={onGoToAdminLogin} className="text-sm text-gray-500 hover:text-brand-primary hover:underline transition-colors">
                Acesso Administrador
            </button>
        </div>
      </main>
    </>
  );
};

export default Dashboard;