import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TicketIcon, SpinnerIcon } from './icons';
import { UserRole } from '../types';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.User); // Default to User
  const [adminId, setAdminId] = useState(''); // State for adminId
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (role === UserRole.Admin && !adminId.trim()) {
      setError('Admin role requires a unique Admin ID.');
      return;
    }
    if (role === UserRole.User && adminId.trim()) {
        setError('Regular user cannot have an Admin ID.');
        return;
    }

    const success = await register(username, password, role, role === UserRole.Admin ? adminId.trim() : undefined);
    if (!success) {
      setError('Registration failed. Username might be taken or Admin ID might be invalid/taken.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <TicketIcon className="h-14 w-14 text-brand-primary mx-auto mb-2" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create a new account
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Choose a Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200"
                placeholder="e.g., newuser"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Choose a Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200"
                placeholder="Minimum 6 characters"
                disabled={isLoading}
              />
            </div>
          </div>

          <div> {/* Role selection */}
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Role
            </label>
            <div className="mt-1">
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 appearance-none cursor-pointer"
                disabled={isLoading}
              >
                <option value={UserRole.User}>User</option>
                <option value={UserRole.Admin}>Admin</option>
              </select>
            </div>
          </div>

          {role === UserRole.Admin && (
            <div> {/* Admin ID input, conditional render */}
              <label htmlFor="adminId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Unique Admin ID
              </label>
              <div className="mt-1">
                <input
                  id="adminId"
                  name="adminId"
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200"
                  placeholder="e.g., A123B456"
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This ID is required for admin accounts and must be unique.
                </p>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-blue-300 dark:disabled:bg-blue-800 transition-all duration-200"
            >
              {isLoading ? <><SpinnerIcon className="animate-spin h-5 w-5 mr-3" /> Registering...</> : 'Register'}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="font-medium text-brand-primary hover:text-blue-500 transition-colors duration-200" disabled={isLoading}>
                    Sign in
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};