import { createContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'cashier';
};

type AuthContextType = {
  user: User | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, role: 'admin' | 'cashier') => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  initialized: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setInitialized(true);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    // In a real app, this would call the backend API
    // For demonstration, we're simulating a successful login with hardcoded users
    if (email === 'admin@example.com' && password === 'password') {
      const adminUser: User = {
        id: '1',
        username: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
    } else if (email === 'cashier@example.com' && password === 'password') {
      const cashierUser: User = {
        id: '2',
        username: 'Cashier User',
        email: 'cashier@example.com',
        role: 'cashier',
      };
      setUser(cashierUser);
      localStorage.setItem('user', JSON.stringify(cashierUser));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  // Signup function
  const signup = async (username: string, email: string, password: string, role: 'admin' | 'cashier') => {
    // In a real app, this would call the backend API
    // For demonstration, we're simulating a successful signup
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      role,
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initialized,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};