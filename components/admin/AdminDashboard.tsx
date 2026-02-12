
import React, { useState } from 'react';
import Header from '../layout/Header';
import AllAppointmentsList from './AllAppointmentsList';
import PriceManager from './PriceManager';
import AnnouncementManager from './AnnouncementManager';

type AdminTab = 'appointments' | 'prices' | 'announcements';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('appointments');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appointments':
        return <AllAppointmentsList />;
      case 'prices':
        return <PriceManager />;
      case 'announcements':
        return <AnnouncementManager />;
      default:
        return <AllAppointmentsList />;
    }
  }

  const TabButton: React.FC<{tab: AdminTab, label: string}> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-semibold rounded-t-lg transition-colors duration-300 ${activeTab === tab ? 'bg-white text-brand-primary' : 'bg-transparent text-brand-text hover:bg-white/50'}`}
    >
      {label}
    </button>
  );

  return (
    <>
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="border-b border-brand-primary/30 mb-6">
          <TabButton tab="appointments" label="Agendamentos" />
          <TabButton tab="prices" label="Gerenciar Preços" />
          <TabButton tab="announcements" label="Gerenciar Anúncios" />
        </div>
        <div>
          {renderTabContent()}
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
