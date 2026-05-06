import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    // Load initial settings from localStorage or default
    const [currency, setCurrency] = useState(() => localStorage.getItem('mv_currency') || 'USD');
    const [theme, setTheme] = useState(() => localStorage.getItem('mv_theme') || 'dark');
    const [userProfile, setUserProfile] = useState(() => {
        const saved = localStorage.getItem('mv_profile');
        return saved ? JSON.parse(saved) : {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: null // URL or data UI
        };
    });

    const [notifications, setNotifications] = useState({
        expenseAlerts: true,
        groupUpdates: true,
        budgetExceeded: true
    });

    // Persist settings
    useEffect(() => {
        localStorage.setItem('mv_currency', currency);
    }, [currency]);

    useEffect(() => {
        localStorage.setItem('mv_theme', theme);
        const root = window.document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('mv_profile', JSON.stringify(userProfile));
    }, [userProfile]);

    const value = {
        currency,
        setCurrency,
        theme,
        setTheme,
        userProfile,
        setUserProfile,
        notifications,
        setNotifications
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
