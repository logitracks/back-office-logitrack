'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import api from '@/lib/axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Interface pour le payload du JWT
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  // Ces champs peuvent ne pas être présents
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken);
        // Vérifier si le token est expiré
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
        } else {
          // Ces appels setState sont sécurisés car l'effet ne s'exécute qu'une fois
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setToken(storedToken);
          setUser({
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
            firstName: decoded.firstName || '',
            lastName: decoded.lastName || '',
          });
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(user);
      router.push('/dashboard');
    } catch (error: unknown) {
      // On relance l'erreur pour que le composant puisse l'afficher
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}