import React, { useState } from 'react';
import { Ticket, TicketStatus, TicketPriority, UserRole, CommunicationMessage, User } from '../types';
import { PriorityBadge } from './PriorityBadge';
import { CalendarIcon, CheckCircleIcon, ChevronDownIcon, ClockIcon, TrashIcon, StarIcon, UserCircleIcon, PaperAirplaneIcon, ChatBubbleLeftRightIcon, LockClosedIcon, InformationCircleIcon, PencilIcon } from './icons';

interface TicketItemProps {
  ticket: Ticket;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  userRole: UserRole;
  onAddMessage: (ticketId: string, content: string, isPrivate: boolean) => void;
  currentUser: User;
  onStartEdit: (ticket: Ticket) => void;
}

const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    
    return `${Math.floor(seconds)} seconds ago`;
}

const DisplayRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center text-lg">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`h-6 w-6 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400" aria-label={`${rating} out of 5 stars`}>({rating} / 5)</span>
    </div>
);

const UserInfoCard: React.FC<{ author: string, userId: string }> = ({ author, userId }) => (
    <div className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-xl">
        <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Submitter Information</h4>
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <p><span className="font-medium">Username:</span> {author}</p>
            <p><span className="font-medium">User ID:</span> {userId}</p>
        </div>
    </div>
);

type MessageSortOrder = 'newest' | 'oldest';

const CommunicationThread: React.FC<{ 
    initialMessages: CommunicationMessage[]; 
    currentUser: User; 
    onSendMessage: (content: string, isPrivate: boolean) => void; 
    isInternalThread: boolean;
}> = ({ initialMessages, currentUser, onSendMessage, isInternalThread }) => {
    const [newMessage, setNewMessage] = useState('');
    const [sortOrder, setSortOrder] = useState<MessageSortOrder>('newest'); // Default to newest first
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const sortedMessages = React.useMemo(() => {
        return [...initialMessages].sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [initialMessages, sortOrder]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    React.useEffect(() => {
        // Only scroll to bottom if sorting by newest, otherwise preserve scroll position.
        if (sortOrder === 'newest') {
            scrollToBottom();
        }
    }, [sortedMessages, sortOrder]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim(), isInternalThread);
            setNewMessage('');
        }
    };
    
    return (
        <div>
            <div className="flex justify-end mb-4">
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as MessageSortOrder)}
                    className="block w-40 pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary text-sm appearance-none cursor-pointer transition-colors duration-200"
                    aria-label="Sort messages"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar">
                {sortedMessages.length > 0 ? sortedMessages.map(msg => (
                    <div key={msg.id} className={`flex items-start gap-2.5 ${msg.authorId === currentUser.id ? 'justify-end' : ''}`}>
                         <div className={`flex flex-col w-full max-w-xs md:max-w-md p-3 rounded-xl shadow-sm ${
                             msg.authorId === currentUser.id 
                             ? 'bg-brand-primary text-white rounded-br-none' 
                             : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                         }`}>
                             <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1.5">
                                <span className="text-sm font-semibold">{msg.authorName} {msg.authorRole === UserRole.Admin && <span className="text-xs font-normal opacity-80">(Admin)</span>}</span>
                                <span className="text-xs font-normal opacity-70">{timeAgo(msg.timestamp)}</span>
                            </div>
                            <p className="text-sm font-normal whitespace-pre-wrap break-words">{msg.content}</p>
                            {msg.isPrivate && (
                                <div className="flex items-center text-xs opacity-80 mt-1.5 pt-1.5 border-t border-white/20 dark:border-gray-600/50">
                                    <LockClosedIcon className="h-3 w-3 mr-1" /> Internal Note
                                </div>
                            )}
                         </div>
                    </div>
                )) : (
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-6">No messages yet. Be the first to add one!</p>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
                <textarea
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    rows={1}
                    placeholder="Type your message..."
                    className="flex-grow block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-none transition-colors duration-200"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    aria-label="New message input"
                />
                <button type="submit" className="inline-flex justify-center p-3 text-white bg-brand-primary rounded-full shadow-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200" disabled={!newMessage.trim()}>
                    <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                    <span className="sr-only">Send message</span>
                </button>
            </form>
        </div>
    );
};


const TabButton: React.FC<{ 
    isActive: boolean; 
    onClick: () => void;
    children: React.ReactNode;
}> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-base font-medium border-b-2 -mb-px transition-colors duration-200
        ${isActive 
            ? 'border-brand-primary text-brand-primary dark:text-blue-400' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'}`}
        role="tab"
        aria-selected={isActive}
    >
        {children}
    </button>
);


export const TicketItem: React.FC<TicketItemProps> = ({ ticket, onToggleStatus, onDelete, userRole, onAddMessage, currentUser, onStartEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'communication' | 'internal'>('details');

  const priorityBorderColor = {
    [TicketPriority.High]: 'border-red-500',
    [TicketPriority.Medium]: 'border-yellow-500',
    [TicketPriority.Low]: 'border-blue-500',
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
        onDelete(ticket.id);
    }
  }

  const publicMessages = (ticket.communications || []).filter(m => !m.isPrivate);
  const privateMessages = (ticket.communications || []).filter(m => m.isPrivate);

  return (
    <div className={`border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/70 rounded-xl p-5 shadow-custom transition-all duration-300 hover:shadow-lg hover:border-brand-primary/50 border-l-4 ${priorityBorderColor[ticket.priority]}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-1 leading-tight">
            <span className="text-gray-400 dark:text-gray-500 font-normal text-base mr-2">#{ticket.id}</span>
            {ticket.title}
          </h3>
          <div className="flex items-center flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
            <PriorityBadge priority={ticket.priority} />
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
              <span className="sr-only">Created:</span>
              <span>{timeAgo(ticket.createdAt)}</span>
            </div>
            {userRole === UserRole.Admin && (
              <div className="flex items-center">
                  <UserCircleIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                  <span className="sr-only">Author:</span>
                  <span>{ticket.author}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3 pl-2">
           {userRole === UserRole.Admin ? (
            <button
                onClick={() => onToggleStatus(ticket.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center transition-colors duration-200 shadow-sm
                ${ticket.status === TicketStatus.Open
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800'
                    : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                }`}
                aria-label={ticket.status === TicketStatus.Open ? 'Mark as Resolved' : 'Re-Open Ticket'}
            >
                {ticket.status === TicketStatus.Open ? (
                    <>
                        <ClockIcon className="h-4 w-4 mr-2"/> Mark Resolved
                    </>
                ) : (
                    <>
                        <CheckCircleIcon className="h-4 w-4 mr-2" /> Re-Open
                    </>
                )}
            </button>
           ) : (
            <span className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center shadow-sm
                ${ticket.status === TicketStatus.Open
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            }`}>
                 {ticket.status === TicketStatus.Open ? (
                    <>
                        <ClockIcon className="h-4 w-4 mr-2"/> Open
                    </>
                ) : (
                    <>
                        <CheckCircleIcon className="h-4 w-4 mr-2" /> Resolved
                    </>
                )}
            </span>
           )}
           <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-gray-800 transition-transform duration-200"
            aria-expanded={isExpanded}
            aria-controls={`ticket-content-${ticket.id}`}
            title={isExpanded ? 'Collapse ticket details' : 'Expand ticket details'}
          >
            <ChevronDownIcon className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      {isExpanded && (
        <div id={`ticket-content-${ticket.id}`} className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700 animate-fade-in" >
            <div className="flex border-b border-gray-200 dark:border-gray-600 mb-4" role="tablist">
                <TabButton isActive={activeTab === 'details'} onClick={() => setActiveTab('details')}>
                    <InformationCircleIcon className="h-5 w-5"/> Details
                </TabButton>
                <TabButton isActive={activeTab === 'communication'} onClick={() => setActiveTab('communication')}>
                    <ChatBubbleLeftRightIcon className="h-5 w-5"/> Communication
                </TabButton>
                {userRole === UserRole.Admin && (
                    <TabButton isActive={activeTab === 'internal'} onClick={() => setActiveTab('internal')}>
                        <LockClosedIcon className="h-5 w-5"/> Internal Notes
                    </TabButton>
                )}
            </div>

            {activeTab === 'details' && (
                <div className="space-y-5">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
                    {userRole === UserRole.Admin && <UserInfoCard author={ticket.author} userId={ticket.userId} />}
                    {ticket.status === TicketStatus.Resolved && ticket.feedback && (
                        <div className="pt-5 border-t border-dashed border-gray-200 dark:border-gray-700">
                            <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">User Feedback</h4>
                            <DisplayRating rating={ticket.feedback.rating} />
                            {ticket.feedback.comment && (
                                <blockquote className="mt-3 pl-4 border-l-4 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 italic">
                                    <p>"{ticket.feedback.comment}"</p>
                                </blockquote>
                            )}
                        </div>
                    )}
                    <div className="pt-5 flex justify-end space-x-3 border-t border-gray-100 dark:border-gray-700/50">
                        {/* Only the ticket author (user) can edit the ticket */}
                        {(currentUser.id === ticket.userId) && (
                             <button
                                onClick={() => onStartEdit(ticket)}
                                className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors duration-200"
                                aria-label="Edit ticket"
                            >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit Ticket
                            </button>
                        )}
                        {userRole === UserRole.Admin && (
                            <button
                                onClick={handleDelete}
                                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-md hover:bg-red-200 dark:hover:bg-red-900 transition-colors duration-200"
                                aria-label="Delete ticket"
                            >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete Ticket
                            </button>
                        )}
                    </div>
                </div>
            )}
            
            {activeTab === 'communication' && (
                <CommunicationThread 
                    initialMessages={publicMessages}
                    currentUser={currentUser}
                    onSendMessage={(content) => onAddMessage(ticket.id, content, false)}
                    isInternalThread={false}
                />
            )}

            {activeTab === 'internal' && userRole === UserRole.Admin && (
                 <CommunicationThread 
                    initialMessages={privateMessages}
                    currentUser={currentUser}
                    onSendMessage={(content) => onAddMessage(ticket.id, content, true)}
                    isInternalThread={true}
                />
            )}
        </div>
      )}
    </div>
  );
};