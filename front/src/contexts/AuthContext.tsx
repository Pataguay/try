import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'cliente' | 'vendedor';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  cpf?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'João Cliente',
    email: 'cliente@teste.com',
    type: 'cliente',
    cpf: '123.456.789-00',
    phone: '(11) 99999-9999',
    password: '123456'
  },
  {
    id: '2',
    name: 'Maria Vendedora',
    email: 'vendedor@teste.com',
    type: 'vendedor',
    cpf: '987.654.321-00',
    phone: '(11) 88888-8888',
    password: '123456'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Primeiro tenta login nos mock users
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setToken('mock-token');
      return true;
    }

    // Se não encontrou, tenta login no backend
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      setUser({
        id: data.id?.toString() || '',
        name: data.name,
        email: data.email,
        type: data.role === 'produtor' ? 'vendedor' : 'cliente',
        cpf: data.cpf,
        phone: data.phone,
      });
      setToken(data.token);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    const newUser: User & { password: string } = {
      ...userData,
      id: Date.now().toString()
    };
    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setToken('mock-token');
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}