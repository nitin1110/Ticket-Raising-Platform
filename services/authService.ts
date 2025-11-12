import { User, UserRole } from "../types";

// Key for storing all mock users in localStorage
const USERS_STORAGE_KEY = 'mockUsers';

// Function to load users from localStorage
const loadUsers = (): User[] => {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
        try {
            return JSON.parse(storedUsers);
        } catch (e) {
            console.error("Failed to parse users from localStorage", e);
            // Fallback to initial users if parsing fails
            return [
                { id: '1', username: 'admin', password: 'adminpassword', role: UserRole.Admin, adminId: 'adm1' },
                { id: '2', username: 'user', password: 'userpassword', role: UserRole.User },
            ];
        }
    }
    // Initial mock users if no users are found in localStorage
    return [
        { id: '1', username: 'admin', password: 'adminpassword', role: UserRole.Admin, adminId: 'adm1' },
        { id: '2', username: 'user', password: 'userpassword', role: UserRole.User },
    ];
};

// Internal mutable array for mock users
let MOCK_USERS: User[] = loadUsers();

// Function to persist the current MOCK_USERS array to localStorage
const _persistUsers = () => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS));
};

export const authService = {
  login: async (username: string, password_input: string): Promise<User | null> => {
    console.log(`Attempting to log in as ${username}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    // Ensure MOCK_USERS is up-to-date with any previous registrations
    MOCK_USERS = loadUsers(); 

    const user = MOCK_USERS.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && u.password === password_input
    );
    if (user) {
        console.log('Login successful:', user);
        localStorage.setItem('authUser', JSON.stringify(user));
        return user;
    }
    console.log('Login failed: invalid credentials');
    return null;
  },

  logout: async (): Promise<void> => {
    console.log('Logging out');
    localStorage.removeItem('authUser');
    await new Promise(resolve => setTimeout(resolve, 200));
  },

  register: async (username: string, password_input: string, role: UserRole, adminId_input?: string): Promise<User | null> => {
    console.log(`Attempting to register ${username} with role ${role} and adminId: ${adminId_input}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Ensure MOCK_USERS is up-to-date before checking for existing users
    MOCK_USERS = loadUsers();

    // Check for existing username
    const existingUser = MOCK_USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
        console.log('Registration failed: username taken');
        return null;
    }

    // Role-specific validation
    if (role === UserRole.Admin) {
        if (!adminId_input || adminId_input.trim() === '') {
            console.log('Registration failed: Admin role requires an Admin ID.');
            return null;
        }
        // Check for unique adminId among existing admin users
        if (MOCK_USERS.some(u => u.role === UserRole.Admin && u.adminId === adminId_input)) {
            console.log('Registration failed: Admin ID already taken.');
            return null;
        }
    } else { // UserRole.User
        if (adminId_input && adminId_input.trim() !== '') {
            console.log('Registration failed: Regular user cannot have an Admin ID.');
            return null;
        }
    }

    const newUser: User = {
        id: String(Date.now() + Math.random()), // More unique ID generation
        username,
        password: password_input,
        role,
        ...(role === UserRole.Admin && { adminId: adminId_input }) // Add adminId only if role is Admin
    };

    MOCK_USERS.push(newUser); // Add new user to our mock data
    _persistUsers(); // Persist the updated user list
    localStorage.setItem('authUser', JSON.stringify(newUser));
    console.log('Registration successful:', newUser);
    return newUser;
  },

  getLoggedInUser: (): User | null => {
    const userJson = localStorage.getItem('authUser');
    if (userJson) {
        try {
            const user = JSON.parse(userJson) as User;
            // Basic validation for admin users on load: ensure they have an adminId if they're an Admin
            if (user.role === UserRole.Admin && !user.adminId) {
                console.warn("Loaded admin user without an adminId. Invalidating session.");
                localStorage.removeItem('authUser'); // Clear invalid session
                return null;
            }
            // Optional: Re-validate against MOCK_USERS to ensure user still exists in the "database"
            // For a mock, this might be overly complex, but in a real app, token validation would happen here.
            MOCK_USERS = loadUsers(); // Ensure current MOCK_USERS is loaded
            const foundUser = MOCK_USERS.find(u => u.id === user.id && u.username === user.username && u.role === user.role);
            if (!foundUser) {
                console.warn("Logged in user not found in mock database. Invalidating session.");
                localStorage.removeItem('authUser'); // Clear invalid session
                return null;
            }
            return foundUser; // Return the user from MOCK_USERS to ensure consistency
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            localStorage.removeItem('authUser'); // Clear corrupted data
            return null;
        }
    }
    return null;
  }
};