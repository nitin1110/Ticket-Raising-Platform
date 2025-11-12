import React from 'react';
import { TicketPriority } from '../types';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const priorityStyles = {
    [TicketPriority.Low]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [TicketPriority.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [TicketPriority.High]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${priorityStyles[priority]}`}>
      {priority}
    </span>
  );
};