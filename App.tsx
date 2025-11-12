import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Header } from './components/Header';
import { DashboardMetrics } from './components/DashboardMetrics';
import { SearchAndSort } from './components/SearchAndSort';
import { FilterControls } from './components/FilterControls';
import { TicketForm } from './components/TicketForm';
import { TicketList } from './components/TicketList';
import { FeedbackForm } from './components/FeedbackForm';
import { EditTicketModal } from './components/EditTicketModal';
import { Ticket, TicketStatus, TicketPriority, UserRole, StatusFilter, PriorityFilter, SortOption, Feedback, CommunicationMessage } from './types';
import { suggestPriority } from './services/geminiService';

// Mock data for initial state
const MOCK_TICKETS: Ticket[] = [
  { id: '1', title: 'Cannot reset password', description: 'The "Forgot Password" link is not working. I am not receiving any email.', priority: TicketPriority.High, status: TicketStatus.Open, createdAt: new Date(Date.now() - 86400000).toISOString(), userId: '2', author: 'user', communications: [
      { id: 'msg1', authorId: '1', authorName: 'admin', authorRole: UserRole.Admin, content: 'We are looking into this issue. Can you confirm which browser you are using?', timestamp: new Date(Date.now() - 7200000).toISOString(), isPrivate: false },
      { id: 'msg2', authorId: '2', authorName: 'user', authorRole: UserRole.User, content: 'I am using Google Chrome on Windows 11.', timestamp: new Date(Date.now() - 3600000).toISOString(), isPrivate: false },
      { id: 'msg3', authorId: '1', authorName: 'admin', authorRole: UserRole.Admin, content: '@dev-team, please check the mail server logs. Seems like a configuration issue.', timestamp: new Date(Date.now() - 1800000).toISOString(), isPrivate: true },
    ] 
  },
  { id: '2', title: 'Profile picture not updating', description: 'When I upload a new profile picture, the old one still appears. Caching issue?', priority: TicketPriority.Medium, status: TicketStatus.Open, createdAt: new Date(Date.now() - 172800000).toISOString(), userId: '2', author: 'user' },
  { id: '3', title: 'Typo on the homepage', description: 'In the main hero section, the word "innovative" is misspelled as "innovativ".', priority: TicketPriority.Low, status: TicketStatus.Resolved, createdAt: new Date(Date.now() - 259200000).toISOString(), userId: '3', author: 'another_user', feedback: { rating: 5, comment: 'Quick fix, thanks!' } },
];

const App: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const savedTickets = localStorage.getItem('tickets');
      return savedTickets ? JSON.parse(savedTickets) : MOCK_TICKETS;
    } catch (error) {
      console.error("Could not parse tickets from localStorage", error);
      return MOCK_TICKETS;
    }
  });

  // Filtering and sorting state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Modal states
  const [feedbackTicket, setFeedbackTicket] = useState<Ticket | null>(null);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);


  useEffect(() => {
    // Theme logic
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    // Persist tickets to localStorage whenever they change.
    try {
        localStorage.setItem('tickets', JSON.stringify(tickets));
    } catch (error) {
        console.error("Could not save tickets to localStorage", error);
    }
  }, [tickets]);

  const handleCreateTicket = async (title: string, description: string) => {
    if (!user) return;
    const newPriority = await suggestPriority(title, description);
    const newTicket: Ticket = {
      id: String(Date.now()),
      title,
      description,
      priority: newPriority,
      status: TicketStatus.Open,
      createdAt: new Date().toISOString(),
      userId: user.id,
      author: user.username,
    };
    setTickets(prev => [newTicket, ...prev]);
  };
  
  const handleToggleStatus = (id: string) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === id) {
          const newStatus = t.status === TicketStatus.Open ? TicketStatus.Resolved : TicketStatus.Open;
          // If user resolves their own ticket, prompt for feedback
          if (newStatus === TicketStatus.Resolved && user?.role === UserRole.User) {
            setFeedbackTicket(t);
          }
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };
  
  const handleDeleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateTicket = (id: string, title: string, description: string) => {
    setTickets(prev =>
        prev.map(t =>
            t.id === id ? { ...t, title, description } : t
        )
    );
    setEditingTicket(null);
  };

  const handleFeedbackSubmit = (rating: number, comment: string) => {
    if (!feedbackTicket) return;
    const feedback: Feedback = { rating, comment };
    setTickets(prev =>
        prev.map(t =>
            t.id === feedbackTicket.id ? { ...t, feedback } : t
        )
    );
    setFeedbackTicket(null);
  };

  const handleAddMessage = (ticketId: string, content: string, isPrivate: boolean) => {
    if (!user) return;

    setTickets(prev => 
        prev.map(ticket => {
            if (ticket.id === ticketId) {
                const newMessage: CommunicationMessage = {
                    id: String(Date.now()),
                    authorId: user.id,
                    authorName: user.username,
                    authorRole: user.role,
                    content,
                    timestamp: new Date().toISOString(),
                    isPrivate,
                };
                return {
                    ...ticket,
                    communications: [...(ticket.communications || []), newMessage]
                };
            }
            return ticket;
        })
    );
};

  const filteredAndSortedTickets = useMemo(() => {
    return tickets
      .filter(ticket => {
        const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
        const matchesSearch =
          searchQuery.trim() === '' ||
          ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Admins see all tickets, users only see their own
        const matchesUser = user?.role === UserRole.Admin || ticket.userId === user?.id;

        return matchesStatus && matchesPriority && matchesSearch && matchesUser;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'priority') {
          const priorityOrder = { [TicketPriority.High]: 3, [TicketPriority.Medium]: 2, [TicketPriority.Low]: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return 0;
      });
  }, [tickets, statusFilter, priorityFilter, searchQuery, sortBy, user]);

  const stats = useMemo(() => {
    const userTickets = user?.role === UserRole.Admin ? tickets : tickets.filter(t => t.userId === user?.id);
    return {
        total: userTickets.length,
        open: userTickets.filter(t => t.status === TicketStatus.Open).length,
        resolved: userTickets.filter(t => t.status === TicketStatus.Resolved).length,
        highPriorityOpen: userTickets.filter(t => t.status === TicketStatus.Open && t.priority === TicketPriority.High).length
    }
  }, [tickets, user]);

   const filterCounts = useMemo(() => {
    const relevantTickets = (user?.role === UserRole.Admin ? tickets : tickets.filter(t => t.userId === user?.id))
        .filter(ticket => 
            searchQuery.trim() === '' ||
            ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return {
        open: relevantTickets.filter(t => t.status === TicketStatus.Open).length,
        resolved: relevantTickets.filter(t => t.status === TicketStatus.Resolved).length,
        high: relevantTickets.filter(t => t.priority === TicketPriority.High).length,
        medium: relevantTickets.filter(t => t.priority === TicketPriority.Medium).length,
        low: relevantTickets.filter(t => t.priority === TicketPriority.Low).length,
    }
   }, [tickets, user, searchQuery]);

  if (isAuthLoading) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900" />; // Or a proper loading spinner screen
  }

  if (!user) {
    return isLoginView ? (
      <Login onSwitchToRegister={() => setIsLoginView(false)} />
    ) : (
      <Register onSwitchToLogin={() => setIsLoginView(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors font-sans">
      <Header theme={theme} setTheme={setTheme} />
      <main className="container mx-auto p-4 md:p-8">
        
        {user.role === UserRole.Admin && <DashboardMetrics stats={stats} />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-1 space-y-8 lg:sticky top-8">
                {user.role === UserRole.User && <TicketForm onCreateTicket={handleCreateTicket} />}
                <FilterControls
                    statusFilter={statusFilter}
                    priorityFilter={priorityFilter}
                    onStatusChange={setStatusFilter}
                    onPriorityChange={setPriorityFilter}
                    counts={filterCounts}
                    total={filteredAndSortedTickets.length}
                />
            </div>
            <div className="lg:col-span-3">
                <SearchAndSort 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
                <TicketList 
                  tickets={filteredAndSortedTickets} 
                  onToggleStatus={handleToggleStatus} 
                  onDelete={handleDeleteTicket}
                  userRole={user.role}
                  onAddMessage={handleAddMessage}
                  currentUser={user}
                  onStartEdit={(ticket) => setEditingTicket(ticket)}
                />
            </div>
        </div>
      </main>
      {editingTicket && (
        <EditTicketModal 
            ticket={editingTicket}
            onClose={() => setEditingTicket(null)}
            onSave={handleUpdateTicket}
        />
      )}
      {feedbackTicket && (
        <FeedbackForm 
            ticketTitle={feedbackTicket.title}
            onClose={() => setFeedbackTicket(null)}
            onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default App;