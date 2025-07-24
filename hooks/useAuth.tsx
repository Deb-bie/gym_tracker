'use client';

import React, { useState, useEffect, createContext, useContext} from 'react';
import { useRouter,  useSearchParams, usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import { LoginCredentials, SignupData, User } from '@/shared/api';
import { cookies } from 'next/headers';


interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function setAuthCookie(token: string) {
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;
}


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    checkAuthStatus();
    
    if (user) {
    }
    
    // Handle Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const authError = ""
    
    if (token) {
      localStorage.setItem('token', token);
      // Remove token from URL
      router.replace(pathname);
      // window.history.replaceState({}, document.title, window.location.pathname);
      // Fetch user data
      checkAuthStatus();
    } else if (authError) {
      setError(decodeURIComponent(authError));
      // Remove error from URL
      // window.history.replaceState({}, document.title, window.location.pathname);
      router.replace(pathname);
    }
  }, []);


  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token');

      if (token) { 
        const response = await api.get("/api/v1/users/me", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status == 200) {
          const userData = await response.data.data;
          setUser(userData)
        } else {
          setUser(null)
          localStorage.removeItem('token');
          return;
        }
      } else {
        setLoading(false);
        setUser(null);
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null)
      localStorage.removeItem('token');
    } finally {
      setLoading(false)
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/api/v1/users/login", {
        body: credentials
      })

      if (response.status == 200) {
        localStorage.setItem('token', response.data.token)

        const user_data = {
          id: response.data.data.id,
          username: response.data.data.username,
          email: response.data.data.email
        }
        setUser(user_data)
        router.push("/")
      }

    } catch (error) {
      setError(error!.response!.data.message || 'Login failed')
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post("/api/v1/users/register", {
        body: userData
      })

      if (response.status == 201) {
        localStorage.setItem('token', response.data.token)

        const user_data = {
          id: response.data.data.id,
          username: response.data.data.username,
          email: response.data.data.email
        }
        setUser(user_data)

        router.push("/")
      }

    } catch (error) {
      setError(error?.response?.data.message || 'Signup failed')
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error }}>
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
