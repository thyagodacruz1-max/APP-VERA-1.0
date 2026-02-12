
import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import AdminDashboard from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
    const { currentUser } = useApp();
    const [isLoginView, setIsLoginView] = useState(false);

    // If admin is logged in, show the admin dashboard
    if (currentUser?.isAdmin) {
        return <AdminDashboard />;
    }
    
    // If a legacy regular user is somehow logged in, show them the dashboard
    if (currentUser && !currentUser.isAdmin) {
        return <Dashboard onGoToAdminLogin={() => setIsLoginView(true)} />;
    }
    
    // For anonymous users, show the login page if they clicked the admin access link
    if (isLoginView) {
        return <Login onBackToHome={() => setIsLoginView(false)} />;
    }

    // By default, everyone sees the public scheduling dashboard
    return <Dashboard onGoToAdminLogin={() => setIsLoginView(true)} />;
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