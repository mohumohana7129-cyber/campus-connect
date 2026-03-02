import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'organizer' | 'student';

export interface AppUser {
  email: string;
  role: UserRole;
  department?: string;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  currentUser: AppUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  // Admin-only: manage organizer roles
  assignOrganizer: (email: string) => void;
  revokeOrganizer: (email: string) => void;
  getAllUsers: () => AppUser[];
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const USERS_KEY = 'campus_users';
const SESSION_KEY = 'campus_session';

// Pre-authorized admin (immutable)
const ADMIN_EMAIL = 'admin@college.edu';

// Department list for student auto-assignment
const DEPARTMENTS = [
  'Computer Science', 'Electrical Engineering', 'Mechanical Engineering',
  'Business Administration', 'Fine Arts', 'Physics', 'English',
  'Media Studies', 'Communication', 'Biotechnology', 'Environmental Science',
  'Physical Education', 'Student Affairs', 'Career Services', 'Mathematics',
  'Chemistry', 'Economics', 'Psychology', 'Sociology', 'History'
];

const getDefaultDepartment = (email: string): string => {
  // Simple hash-based department assignment for demo
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i);
    hash |= 0;
  }
  return DEPARTMENTS[Math.abs(hash) % DEPARTMENTS.length];
};

const getStoredUsers = (): AppUser[] => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      const users: AppUser[] = JSON.parse(stored);
      // Ensure admin always exists
      if (!users.find(u => u.email === ADMIN_EMAIL)) {
        users.push({ email: ADMIN_EMAIL, role: 'admin' });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
      return users;
    }
  } catch { /* fallthrough */ }
  
  // Initialize with default users
  const defaults: AppUser[] = [
    { email: ADMIN_EMAIL, role: 'admin' },
    { email: 'organizer@college.edu', role: 'organizer' },
    { email: 'student@college.edu', role: 'student', department: 'Computer Science' },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
  return defaults;
};

const setStoredUsers = (users: AppUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Restore session
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const user: AppUser = JSON.parse(session);
        // Verify user still exists in the user list with correct role
        const users = getStoredUsers();
        const found = users.find(u => u.email === user.email);
        if (found) {
          setCurrentUser(found);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const login = async (email: string, _password: string): Promise<{ success: boolean; message: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const users = getStoredUsers();
    
    // Find existing user or create as student
    let user = users.find(u => u.email === normalizedEmail);
    
    if (!user) {
      // New email → default Student role
      user = {
        email: normalizedEmail,
        role: 'student',
        department: getDefaultDepartment(normalizedEmail),
      };
      users.push(user);
      setStoredUsers(users);
    }

    // Ensure student has department
    if (user.role === 'student' && !user.department) {
      user.department = getDefaultDepartment(user.email);
      setStoredUsers(users);
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));

    return { success: true, message: `Welcome! Logged in as ${user.role}` };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(SESSION_KEY);
  };

  const assignOrganizer = (email: string) => {
    if (currentUser?.role !== 'admin') return;
    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail === ADMIN_EMAIL) return; // Can't change admin
    
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.email === normalizedEmail);
    if (idx >= 0) {
      users[idx].role = 'organizer';
      delete users[idx].department; // Organizers don't need department
    } else {
      users.push({ email: normalizedEmail, role: 'organizer' });
    }
    setStoredUsers(users);
  };

  const revokeOrganizer = (email: string) => {
    if (currentUser?.role !== 'admin') return;
    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail === ADMIN_EMAIL) return;
    
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.email === normalizedEmail);
    if (idx >= 0) {
      users[idx].role = 'student';
      users[idx].department = getDefaultDepartment(normalizedEmail);
      setStoredUsers(users);
    }
  };

  const getAllUsers = (): AppUser[] => {
    return getStoredUsers();
  };

  return (
    <AdminAuthContext.Provider value={{
      isAuthenticated,
      currentUser,
      login,
      logout,
      assignOrganizer,
      revokeOrganizer,
      getAllUsers,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
