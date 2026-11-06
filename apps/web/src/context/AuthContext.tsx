'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isArtist: boolean;
  isCustomer: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role?: string; artistStatement?: string }) => Promise<void>;
  logout: () => void;
  switchDemoUser: (role: 'admin' | 'collector' | 'artist') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@artsgallery.com',
    password: 'Password123!',
    fallbackUser: {
      id: 'USR-ADMIN',
      name: 'Victoria Saint-Laurent',
      email: 'admin@artsgallery.com',
      role: 'admin' as const,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
  },
  collector: {
    email: 'collector@artsgallery.com',
    password: 'Password123!',
    fallbackUser: {
      id: 'USR-COLLECTOR',
      name: 'Arthur Pendelton',
      email: 'collector@artsgallery.com',
      role: 'customer' as const,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  },
  artist: {
    email: 'elena.rostova@artsgallery.com',
    password: 'Password123!',
    fallbackUser: {
      id: 'USR-ARTIST-1',
      name: 'Elena Rostova',
      email: 'elena.rostova@artsgallery.com',
      role: 'artist' as const,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      artistStatement: 'Exploring chromatic tension and architectural silence across classical oil glazes.',
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialize from localStorage or default to demo collector on first launch
  useEffect(() => {
    const savedToken = localStorage.getItem('arts_gallery_token');
    const savedUser = localStorage.getItem('arts_gallery_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // Fallback default
        setUser(DEMO_CREDENTIALS.collector.fallbackUser);
        setToken('demo-collector-token');
      }
    } else {
      // Default initial session as collector for instant exploratory UX
      setUser(DEMO_CREDENTIALS.collector.fallbackUser);
      setToken('demo-collector-token');
      localStorage.setItem('arts_gallery_user', JSON.stringify(DEMO_CREDENTIALS.collector.fallbackUser));
      localStorage.setItem('arts_gallery_token', 'demo-collector-token');
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('arts_gallery_token', res.token);
      localStorage.setItem('arts_gallery_user', JSON.stringify(res.user));
    } catch (err: any) {
      // Offline fallback matching demo accounts
      const matchedDemo = Object.values(DEMO_CREDENTIALS).find(d => d.email === email);
      if (matchedDemo && password === 'Password123!') {
        setUser(matchedDemo.fallbackUser);
        setToken(`demo-token-${matchedDemo.fallbackUser.role}`);
        localStorage.setItem('arts_gallery_token', `demo-token-${matchedDemo.fallbackUser.role}`);
        localStorage.setItem('arts_gallery_user', JSON.stringify(matchedDemo.fallbackUser));
      } else {
        throw err;
      }
    }
  };

  const register = async (payload: { name: string; email: string; password: string; role?: string; artistStatement?: string }) => {
    const res = await authApi.register(payload);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('arts_gallery_token', res.token);
    localStorage.setItem('arts_gallery_user', JSON.stringify(res.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('arts_gallery_token');
    localStorage.removeItem('arts_gallery_user');
  };

  const switchDemoUser = async (role: 'admin' | 'collector' | 'artist') => {
    const demo = DEMO_CREDENTIALS[role];
    try {
      const res = await authApi.login(demo.email, demo.password);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('arts_gallery_token', res.token);
      localStorage.setItem('arts_gallery_user', JSON.stringify(res.user));
    } catch (err) {
      // Resilient fallback when API is cold
      setUser(demo.fallbackUser);
      setToken(`demo-token-${role}`);
      localStorage.setItem('arts_gallery_token', `demo-token-${role}`);
      localStorage.setItem('arts_gallery_user', JSON.stringify(demo.fallbackUser));
    }
  };

  const isAdmin = user?.role === 'admin';
  const isArtist = user?.role === 'artist';
  const isCustomer = user?.role === 'customer';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isArtist,
        isCustomer,
        login,
        register,
        logout,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
