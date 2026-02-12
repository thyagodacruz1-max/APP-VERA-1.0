
import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
    const { user, currentView, setCurrentView } = useApp();

    if (!user) {
        if (currentView === 'register') {
            return <Register onSwitchToLogin={() => setCurrentView('login')} />;
        }
        return <Login onSwitchToRegister={() => setCurrentView('register')} />;
    }

    if (user.isAdmin) {
        return <AdminDashboard />;
    }

    return <Dashboard />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
        <div className="bg-brand-light min-h-screen font-sans text-brand-text">
            <AppContent />
        </div>
    </AppProvider>
  );
};

export default App;
