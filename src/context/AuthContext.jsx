import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for session
        const storedUser = localStorage.getItem('mv_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock login logic
        // In a real app, verify against backend
        const mockUser = { name: 'John Doe', email, avatar: null };
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('mv_user', JSON.stringify(mockUser));
        return true;
    };

    const register = (name, email, password) => {
        // Mock register logic
        const newUser = { name, email, avatar: null };
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('mv_user', JSON.stringify(newUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('mv_user');
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
