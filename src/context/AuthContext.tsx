"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiRequest } from '@/lib/api';

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    accountStatus: string;
    isAdmin?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<User | null>;
    register: (data: any) => Promise<User | null>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await apiRequest('/auth/me');
                if (response.success) {
                    setUser(response.data.user);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (data: any) => {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (response.success) {
            setUser(response.data.user);
            return response.data.user;
        }
        return null;
    };

    const register = async (data: any) => {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (response.success) {
            setUser(response.data.user);
            return response.data.user;
        }
        return null;
    };

    const logout = async () => {
        await apiRequest('/auth/logout', { method: 'POST' });
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
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
