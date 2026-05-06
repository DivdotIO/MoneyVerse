import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

import { Menu } from 'lucide-react';
import { useState } from 'react';
import CursorFollower from '../ui/CursorFollower';
import ProfileDropdown from '../ui/ProfileDropdown';

const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-text flex">
            <CursorFollower />
            {/* Sidebar - Desktop & Mobile */}
            {/* The Sidebar component is fixed positioned. We need a spacer for desktop layout. */}
            <div className="flex-shrink-0 lg:w-64">
                <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Mobile Sidebar Overlay (Placeholder for interactivity) */}

            {/* Main Content Area */}
            <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-screen scroll-smooth w-full">
                <div className="max-w-7xl mx-auto">
                    <header className="flex justify-between items-center mb-6 lg:mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-2 -ml-2 text-muted hover:text-white"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold">Overview</h2>
                                <p className="text-muted hidden sm:block">Welcome back to your financial verse.</p>
                            </div>
                        </div>
                        {/* User Profile / Actions */}
                        <ProfileDropdown />
                    </header>

                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
