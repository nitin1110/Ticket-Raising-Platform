import React, { useState } from 'react';
import { PlusIcon, SparklesIcon, SpinnerIcon } from './icons';

interface TicketFormProps {
  onCreateTicket: (title: string, description: string) => Promise<void>;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onCreateTicket }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out both title and description.');
      return;
    }
    setIsLoading(true);
    await onCreateTicket(title, description);
    setIsLoading(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl sticky top-8">
      <h2 className="text-xl font-bold mb-5 flex items-center text-gray-800 dark:text-gray-100">
        <PlusIcon className="h-6 w-6 mr-2 text-brand-primary" />
        Create a New Ticket
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200"
            placeholder="e.g., Cannot reset password"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="mt-1 block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 resize-y"
            placeholder="Provide a detailed description of the issue..."
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Analyzing & Creating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5 mr-2" />
              Create with AI Priority
            </>
          )}
        </button>
      </form>
    </div>
  );
};