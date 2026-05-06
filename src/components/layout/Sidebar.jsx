import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Users, Settings, LogOut, Wallet } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: Users, label: 'Groups', path: '/groups' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                ></div>
            )}

            <aside className={cn(
                "fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col p-6 z-50 transition-transform duration-300 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo */}
                <div className="flex items-center justify-between mb-10 text-primary">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-xl">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-text">MoneyVerse</h1>
                    </div>
                    <button onClick={onClose} className="lg:hidden text-muted hover:text-text">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                                        : "text-muted hover:bg-text/5 hover:text-text"
                                )
                            }
                            onClick={() => onClose && onClose()}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>


            </aside>
        </>
    );
};

export default Sidebar;
