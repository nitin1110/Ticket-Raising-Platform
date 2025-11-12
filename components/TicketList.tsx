import React from 'react';
import { Ticket, UserRole, User } from '../types';
import { TicketItem } from './TicketItem';
import { InboxIcon } from './icons';

interface TicketListProps {
  tickets: Ticket[];
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  userRole: UserRole;
  onAddMessage: (ticketId: string, content: string, isPrivate: boolean) => void;
  currentUser: User;
  onStartEdit: (ticket: Ticket) => void;
}

export const TicketList: React.FC<TicketListProps> = ({ tickets, onToggleStatus, onDelete, userRole, onAddMessage, currentUser, onStartEdit }) => {
  return (
    <>
      {tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <TicketItem 
              key={ticket.id} 
              ticket={ticket} 
              onToggleStatus={onToggleStatus} 
              onDelete={onDelete} 
              userRole={userRole}
              onAddMessage={onAddMessage}
              currentUser={currentUser}
              onStartEdit={onStartEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <InboxIcon className="mx-auto h-14 w-14 text-gray-400 mb-4" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-200">No Tickets Found</h3>
            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">Try adjusting your filters or search term.</p>
        </div>
      )}
    </>
  );
};