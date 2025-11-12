import React from 'react';
import { StatusFilter, PriorityFilter, TicketStatus, TicketPriority } from '../types';
import { FilterIcon } from './icons';

interface FilterControlsProps {
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  onStatusChange: (filter: StatusFilter) => void;
  onPriorityChange: (filter: PriorityFilter) => void;
  counts: {
    open: number;
    resolved: number;
    high: number;
    medium: number;
    low: number;
  };
  total: number;
}

const FilterButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    label: string;
    count: number;
}> = ({ onClick, isActive, label, count }) => (
    <button
        onClick={onClick}
        className={`w-full text-left flex justify-between items-center px-4 py-2.5 text-base font-medium rounded-lg transition-colors duration-200
            ${isActive
            ? 'bg-brand-primary text-white shadow-md'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        <span>{label}</span>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
            ${isActive ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
        }`}>
            {count}
        </span>
    </button>
);


export const FilterControls: React.FC<FilterControlsProps> = ({
    statusFilter, priorityFilter, onStatusChange, onPriorityChange, counts, total
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
             <h2 className="text-xl font-bold mb-5 flex items-center text-gray-800 dark:text-gray-100">
                <FilterIcon className="h-6 w-6 mr-2 text-brand-primary" />
                Filter Tickets
            </h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Status</h3>
                    <div className="space-y-2">
                       <FilterButton onClick={() => onStatusChange('All')} isActive={statusFilter === 'All'} label="All Statuses" count={total} />
                       <FilterButton onClick={() => onStatusChange(TicketStatus.Open)} isActive={statusFilter === TicketStatus.Open} label="Open" count={counts.open} />
                       <FilterButton onClick={() => onStatusChange(TicketStatus.Resolved)} isActive={statusFilter === TicketStatus.Resolved} label="Resolved" count={counts.resolved} />
                    </div>
                </div>
                 <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">Priority</h3>
                    <div className="space-y-2">
                        <FilterButton onClick={() => onPriorityChange('All')} isActive={priorityFilter === 'All'} label="All Priorities" count={total} />
                        <FilterButton onClick={() => onPriorityChange(TicketPriority.High)} isActive={priorityFilter === TicketPriority.High} label="High" count={counts.high} />
                        <FilterButton onClick={() => onPriorityChange(TicketPriority.Medium)} isActive={priorityFilter === TicketPriority.Medium} label="Medium" count={counts.medium} />
                        <FilterButton onClick={() => onPriorityChange(TicketPriority.Low)} isActive={priorityFilter === TicketPriority.Low} label="Low" count={counts.low} />
                    </div>
                </div>
            </div>
        </div>
    );
};