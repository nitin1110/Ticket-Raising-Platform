import React, { useState } from 'react';
import { Ticket } from '../types';
import { PencilIcon } from './icons';

interface EditTicketModalProps {
    ticket: Ticket;
    onSave: (id: string, title: string, description: string) => void;
    onClose: () => void;
}

export const EditTicketModal: React.FC<EditTicketModalProps> = ({ ticket, onSave, onClose }) => {
    const [title, setTitle] = useState(ticket.title);
    const [description, setDescription] = useState(ticket.description);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            alert('Title and description cannot be empty.');
            return;
        }
        onSave(ticket.id, title, description);
    };

    return (
        <div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 m-4 w-full max-w-lg transform transition-all">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold flex items-center text-gray-900 dark:text-white">
                        <PencilIcon className="h-6 w-6 mr-2 text-brand-primary" />
                        Edit Ticket #{ticket.id}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl leading-none" aria-label="Close edit modal">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="edit-title" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                id="edit-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-description" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                id="edit-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={8}
                                className="mt-1 block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 resize-y"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-7 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-base font-medium rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-base font-medium rounded-md shadow-md text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};