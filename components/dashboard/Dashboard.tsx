
import React from 'react';
import Header from '../layout/Header';
import Scheduler from './Scheduler';
import AppointmentsList from './AppointmentsList';
import PriceList from '../shared/PriceList';

const Dashboard: React.FC = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2">
            <Scheduler />
            <div className="mt-8">
              <PriceList />
            </div>
          </div>
          <div className="lg:col-span-3">
            <AppointmentsList />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
