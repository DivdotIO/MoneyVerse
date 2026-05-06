import React, { useState } from 'react';
import { ShoppingBag, Wifi, Car, ArrowLeft, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import { useSettings } from '../context/SettingsContext';
import { formatCurrency } from '../utils/format';

const ExpensesHistory = () => {
    const navigate = useNavigate();
    const { expenses } = useExpenses();
    const { currency } = useSettings();
    const [searchTerm, setSearchTerm] = useState('');

    // Logic to convert values if needed (mock conversion: INR = USD * 80)
    // const convert = (val) => currency === 'INR' ? val * 82 : val; // REMOVED

    const filteredExpenses = expenses.filter(ex =>
        ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.amount.toString().includes(searchTerm)
    );

    const iconMap = {
        'ShoppingBag': ShoppingBag,
        'Wifi': Wifi,
        'Car': Car,
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl bg-surface hover:bg-surface/80 text-text transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-text">Expense History</h2>
            </div>

            {/* Search and Filter */}
            <div className="bg-surface p-4 rounded-2xl border border-border flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                        type="text"
                        placeholder="Search expenses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl py-2.5 pl-12 pr-4 text-text focus:outline-none focus:border-primary/50"
                    />
                </div>
                <button className="p-2.5 rounded-xl bg-background border border-border text-muted hover:text-text transition-colors">
                    <Filter className="w-5 h-5" />
                </button>
            </div>

            {/* List */}
            <div className="bg-surface rounded-3xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-bold text-text">All Transactions ({filteredExpenses.length})</h3>
                </div>

                <div className="divide-y divide-border">
                    {filteredExpenses.map((tx) => {
                        const IconComponent = iconMap[tx.iconName] || ShoppingBag;
                        return (
                            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-text/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-text/5 text-primary">
                                        <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-text">{tx.title}</p>
                                        <p className="text-xs text-muted">{tx.date}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-text shadow-black drop-shadow-sm">
                                    {formatCurrency(tx.amount, currency)}
                                </span>
                            </div>
                        );
                    })}

                    {filteredExpenses.length === 0 && (
                        <div className="p-8 text-center text-muted">
                            No expenses found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpensesHistory;
