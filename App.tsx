
import React from 'react';
import { AppProvider } from './contexts/AppContext';
import Dashboard from './components/dashboard/Dashboard';

const App: React.FC = () => {
  return (
    <AppProvider>
        <div className="bg-brand-light min-h-screen font-sans text-brand-text">
            <Dashboard />
        </div>
    </AppProvider>
  );
};

export default App;