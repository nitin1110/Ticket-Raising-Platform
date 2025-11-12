export enum TicketPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum TicketStatus {
  Open = 'Open',
  Resolved = 'Resolved',
}

export interface Feedback {
  rating: number;
  comment: string;
}

export enum UserRole {
    Admin = 'Admin',
    User = 'User',
}

export interface User {
    id: string;
    username: string;
    password?: string;
    role: UserRole;
    adminId?: string; // New: Unique ID for admin users
}

export interface CommunicationMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  timestamp: string;
  isPrivate: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  userId: string;
  author: string;
  feedback?: Feedback;
  communications?: CommunicationMessage[];
}

export type StatusFilter = TicketStatus | 'All';
export type PriorityFilter = TicketPriority | 'All';
export type SortOption = 'newest' | 'oldest' | 'priority';