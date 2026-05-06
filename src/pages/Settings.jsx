import React, { useState, useRef } from 'react';
import { User, Bell, Shield, Wallet, Palette, LogOut, Check, Camera, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useExpenses } from '../context/ExpenseContext';
import { cn } from '../utils/cn';

const Settings = () => {
    const { currency, setCurrency, theme, setTheme, userProfile, setUserProfile } = useSettings();
    const { resetData } = useExpenses();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState({ name: userProfile.name, email: userProfile.email });
    const fileInputRef = useRef(null);

    const currencies = [
        { code: 'USD', symbol: '$', label: 'US Dollar' },
        { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
    ];

    const themes = [
        { id: 'dark', label: 'Dark Mode' },
        { id: 'light', label: 'Light Mode' },
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserProfile(prev => ({ ...prev, avatar: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProfile = () => {
        setUserProfile(prev => ({ ...prev, name: editForm.name, email: editForm.email }));
        setIsEditingProfile(false);
    };

    const handleResetData = () => {
        if (window.confirm("Are you sure you want to reset all updated expenses and income? This action cannot be undone.")) {
            resetData();
            alert("All data has been reset successfully.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
            <h2 className="text-2xl font-bold text-text mb-6">Settings</h2>

            {/* Profile Section */}
            <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden border-4 border-surface">
                        {userProfile.avatar ? (
                            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{userProfile.name.charAt(0)}</span>
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <Camera className="w-8 h-8 text-white" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>

                <div className="flex-1 text-center md:text-left w-full">
                    {isEditingProfile ? (
                        <div className="space-y-3 max-w-md">
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full bg-surface border border-border rounded-lg p-2 text-text focus:outline-none focus:border-primary"
                                placeholder="Your Name"
                            />
                            <input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="w-full bg-surface border border-border rounded-lg p-2 text-text focus:outline-none focus:border-primary"
                                placeholder="Your Email"
                            />
                            <div className="flex gap-2 justify-center md:justify-start">
                                <button onClick={saveProfile} className="px-4 py-1.5 bg-success text-white text-sm font-bold rounded-lg hover:bg-success/90">Save</button>
                                <button onClick={() => setIsEditingProfile(false)} className="px-4 py-1.5 bg-white/10 text-white text-sm font-bold rounded-lg hover:bg-white/20">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold text-text">{userProfile.name}</h3>
                            <p className="text-muted">{userProfile.email}</p>
                            <button
                                onClick={() => {
                                    setEditForm({ name: userProfile.name, email: userProfile.email });
                                    setIsEditingProfile(true);
                                }}
                                className="text-primary text-sm font-medium mt-2 hover:underline inline-block"
                            >
                                Edit Profile
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preferences */}
                <div className="bg-surface p-6 rounded-2xl border border-border space-y-6">
                    <h3 className="text-lg font-bold text-text flex items-center gap-2">
                        <Palette className="w-5 h-5 text-primary" />
                        Preferences
                    </h3>

                    {/* Currency Selector */}
                    <div className="space-y-3">
                        <span className="text-muted text-sm font-medium">Currency</span>
                        <div className="flex gap-2 bg-surface p-1 rounded-xl border border-border">
                            {currencies.map((curr) => (
                                <button
                                    key={curr.code}
                                    onClick={() => setCurrency(curr.code)}
                                    className={cn(
                                        "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                                        currency === curr.code
                                            ? "bg-primary text-white shadow-md"
                                            : "text-muted hover:text-text hover:bg-text/5"
                                    )}
                                >
                                    <span>{curr.symbol} {curr.code}</span>
                                    {currency === curr.code && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Theme Selector */}
                    <div className="space-y-3">
                        <span className="text-muted text-sm font-medium">Theme</span>
                        <div className="flex gap-2 bg-surface p-1 rounded-xl border border-border">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id)}
                                    className={cn(
                                        "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
                                        theme === t.id
                                            ? "bg-text text-surface shadow-md"
                                            : "text-muted hover:text-text hover:bg-text/5"
                                    )}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-surface p-6 rounded-2xl border border-border space-y-6">
                    <h3 className="text-lg font-bold text-text flex items-center gap-2">
                        <Bell className="w-5 h-5 text-secondary" />
                        Notifications
                    </h3>

                    <div className="flex justify-between items-center">
                        <span className="text-muted">Expense Alerts</span>
                        <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted">Group Updates</span>
                        <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted">Budget Exceeded</span>
                        <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Actions */}
            <div className="bg-surface p-6 rounded-2xl border border-border space-y-4">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-text/5 transition-colors text-left group">
                    <div className="flex items-center gap-3 text-muted group-hover:text-text">
                        <Shield className="w-5 h-5" />
                        <span>Privacy & Security</span>
                    </div>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-danger/10 transition-colors text-left group">
                    <div className="flex items-center gap-3 text-danger">
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                    </div>
                </button>
                <button
                    onClick={handleResetData}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-danger/10 transition-colors text-left group"
                >
                    <div className="flex items-center gap-3 text-danger">
                        <Shield className="w-5 h-5" />
                        <span>Reset All Data</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default Settings;
