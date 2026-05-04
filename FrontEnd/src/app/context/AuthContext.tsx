import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  profile?: {
    first_name?: string;
    last_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('jwt_token');

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Always verify against backend — this ensures fresh user data after re-login
        const res = await fetch('/api/v1/users/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          const freshUser = data.data;
          setToken(storedToken);
          setUser(freshUser);
          // Keep localStorage in sync
          localStorage.setItem('user_data', JSON.stringify(freshUser));
        } else {
          // Token expired or invalid — clean up
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user_data');
        }
      } catch {
        // Network error — fall back to cached user data so app still works offline
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
          try {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_data');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('jwt_token', newToken);
    localStorage.setItem('user_data', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
