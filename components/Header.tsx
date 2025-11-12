import React from 'react';
import { TicketIcon } from './icons';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}


export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <TicketIcon className="h-9 w-9 text-brand-primary" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Ticketly
          </h1>
        </div>
        <div className="flex items-center space-x-6">
            {user && (
              <div className="text-right pr-2">
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-base">{user.username}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
            )}
            <ThemeToggle theme={theme} setTheme={setTheme} />
            {user && (
                <button 
                  onClick={logout} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                    Logout
                </button>
            )}
        </div>
      </div>
    </header>
  );
};