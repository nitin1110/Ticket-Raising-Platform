import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TicketIcon, SpinnerIcon } from './icons';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // New state for password
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // isLoading is already managed by AuthContext, so we don't need local loading state
    const success = await login(username, password); // Pass password to login
    if (!success) {
      setError('Invalid username or password. Try "admin" / "adminpassword" or "user" / "userpassword".');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <TicketIcon className="h-14 w-14 text-brand-primary mx-auto mb-2" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200"
                placeholder="admin or user"
                disabled={isLoading}
              />
            </div>
          </div>

          <div> {/* New password input field */}
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200"
                placeholder="password"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-blue-300 dark:disabled:bg-blue-800 transition-all duration-200"
            >
              {isLoading ? <><SpinnerIcon className="animate-spin h-5 w-5 mr-3" /> Signing In...</> : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button onClick={onSwitchToRegister} className="font-medium text-brand-primary hover:text-blue-500 transition-colors duration-200" disabled={isLoading}>
                    Register here
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};