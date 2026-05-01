import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { db } from '@/lib/db';

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isAgent: boolean;
  isOwner: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  isAdmin: false,
  isManager: false,
  isAgent: false,
  isOwner: false,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    // Check for persisted user in MongoDB Mock (localStorage for now)
    const storedUser = localStorage.getItem('mongodb_auth_user');
    if (storedUser) {
      console.log('AuthProvider: Found persisted user', storedUser);
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setRole(localStorage.getItem('mongodb_auth_role') || 'admin');
    }
    setLoading(false);
    console.log('AuthProvider: Loading finished');
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Simulate MongoDB auth check
    if (email === 'demo@pgshaala.com' && password === 'demo1234') {
      const demoUser = { id: 'mongo-demo-user', email, full_name: 'Official Admin' };
      setUser(demoUser);
      setRole('admin');
      localStorage.setItem('mongodb_auth_user', JSON.stringify(demoUser));
      localStorage.setItem('mongodb_auth_role', 'admin');
      setLoading(false);
      return { error: null };
    }
    setLoading(false);
    return { error: { message: 'Invalid credentials' } };
  };

  const signOut = async () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('mongodb_auth_user');
    localStorage.removeItem('mongodb_auth_role');
  };

  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const isAgent = role === 'agent';
  const isOwner = role === 'owner';

  return (
    <AuthContext.Provider value={{ 
      user, role, loading, 
      isAdmin, isManager, isAgent, isOwner,
      signIn, signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
