
import React from 'react';
import { useApp } from '../../contexts/AppContext';

const Announcements: React.FC = () => {
  const { announcements } = useApp();

  // Show only the most recent announcement
  const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;

  if (!latestAnnouncement) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-brand-secondary/50 border border-brand-secondary p-4 rounded-xl text-center">
        <h3 className="font-bold text-brand-dark">Aviso Importante</h3>
        <p className="text-sm text-brand-text mt-1">{latestAnnouncement.content}</p>
      </div>
    </div>
  );
};

export default Announcements;
