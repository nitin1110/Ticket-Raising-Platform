import React from 'react';
import { TicketIcon, CheckCircleIcon, FireIcon, ChartBarIcon, ClockIcon } from './icons';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow-lg flex items-center space-x-5 transition-transform hover:scale-[1.02] duration-200">
        <div className={`p-4 rounded-full ${color} shadow-md`}>
            {icon}
        </div>
        <div>
            <p className="text-base text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
    </div>
);

interface DashboardMetricsProps {
  stats: {
    total: number;
    open: number;
    resolved: number;
    highPriorityOpen: number;
  }
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ stats }) => {
  return (
    <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-gray-100">
            <ChartBarIcon className="h-7 w-7 mr-3 text-brand-primary" />
            Ticket Dashboard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <MetricCard title="Total Tickets" value={stats.total} icon={<TicketIcon className="h-6 w-6 text-white"/>} color="bg-blue-500" />
            <MetricCard title="Open Tickets" value={stats.open} icon={<ClockIcon className="h-6 w-6 text-white"/>} color="bg-yellow-500" />
            <MetricCard title="High Priority Open" value={stats.highPriorityOpen} icon={<FireIcon className="h-6 w-6 text-white"/>} color="bg-red-500" />
            <MetricCard title="Resolved Tickets" value={stats.resolved} icon={<CheckCircleIcon className="h-6 w-6 text-white"/>} color="bg-green-500" />
        </div>
    </div>
  )
}