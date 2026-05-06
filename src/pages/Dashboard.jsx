import { DollarSign, Wallet, PiggyBank, ShoppingBag, Wifi, User, Car, Plus, Pencil } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import SpendingBarChart from '../components/charts/SpendingBarChart';
import ActivityLineChart from '../components/charts/ActivityLineChart';
import ReportDoughnutChart from '../components/charts/ReportDoughnutChart';
import { useSettings } from '../context/SettingsContext';
import { formatCurrency } from '../utils/format';
import ScrollReveal from '../components/ui/ScrollReveal';
import { useExpenses } from '../context/ExpenseContext';
import Modal from '../components/ui/Modal';

const Dashboard = () => {
    const { currency } = useSettings();
    const navigate = useNavigate();

    const { expenses, income, updateIncome } = useExpenses();
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [newIncome, setNewIncome] = useState(income);

    const handleIncomeSave = (e) => {
        e.preventDefault();
        updateIncome(newIncome);
        setIsIncomeModalOpen(false);
    };

    // Mapping icons for rendering dynamically
    const iconMap = {
        'ShoppingBag': ShoppingBag,
        'Wifi': Wifi,
        'Car': Car,
        'DollarSign': DollarSign
    };

    // Logic to convert values if needed (mock conversion: INR = USD * 80)
    // const convert = (val) => currency === 'INR' ? val * 82 : val; // REMOVED: Using direct value

    // Calculate total expense dynamically
    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    // Calculate total savings dynamically
    const totalSavings = income - totalExpense;

    return (
        <div className="space-y-6 animate-fade-in pb-10">

            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text">Dashboard Overview</h2>
                <button
                    onClick={() => navigate('/add-expense')}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/25 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add Expense
                </button>
            </div>

            {/* Top Stats */}
            <ScrollReveal className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group">
                    <StatCard
                        title="TOTAL INCOME"
                        amount={formatCurrency(income, currency)}
                        trend={6}
                        trendLabel="vs last 30 days"
                        icon={DollarSign}
                        color="success"
                    />
                    <button
                        onClick={() => {
                            setNewIncome(income);
                            setIsIncomeModalOpen(true);
                        }}
                        className="absolute top-4 right-4 p-2 rounded-full bg-text/10 text-text opacity-0 group-hover:opacity-100 transition-all hover:bg-text/20"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                </div>
                <StatCard
                    title="TOTAL EXPENSE"
                    amount={formatCurrency(totalExpense, currency)}
                    trend={-2}
                    trendLabel="vs last 30 days"
                    icon={Wallet}
                    color="primary"
                />
                <StatCard
                    title="TOTAL SAVINGS"
                    amount={formatCurrency(totalSavings, currency)}
                    trend={-1}
                    trendLabel="vs last 30 days"
                    icon={PiggyBank}
                    color="secondary"
                />

            </ScrollReveal>

            {/* Main Charts Row 1: Bar Chart (Big) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ScrollReveal className="lg:col-span-2" delay={0.1}>
                    <SpendingBarChart currency={currency} rate={currency === 'INR' ? 82 : 1} />
                </ScrollReveal>
                {/* Side column: Recent Expenses */}
                <ScrollReveal className="bg-surface p-6 rounded-2xl border border-border h-[400px] flex flex-col" delay={0.2}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-text">Recent Expenses</h3>
                        <button onClick={() => navigate('/expenses')} className="text-muted hover:text-text">View All</button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {expenses.map((tx) => {
                            const IconComponent = iconMap[tx.iconName] || ShoppingBag;
                            return (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-text/5 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-full bg-text/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors text-muted">
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-text">{tx.title}</p>
                                            <p className="text-xs text-muted">{tx.date}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-text truncate max-w-[100px] text-right">{formatCurrency(tx.amount, currency)}</span>
                                </div>
                            );
                        })}
                    </div>
                </ScrollReveal>
            </div>

            {/* Row 2: Report Overview and Expense Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ScrollReveal className="lg:col-span-1" delay={0.3}>
                    <ReportDoughnutChart currency={currency} rate={currency === 'INR' ? 82 : 1} />
                </ScrollReveal>
                <ScrollReveal className="lg:col-span-2" delay={0.4}>
                    <ActivityLineChart currency={currency} rate={currency === 'INR' ? 82 : 1} />
                </ScrollReveal>
            </div>
            {/* Income Edit Modal */}
            <Modal
                isOpen={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                title="Update Total Income"
            >
                <form onSubmit={handleIncomeSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-muted mb-2">Total Income</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-muted font-bold text-xl">
                                {currency === 'INR' ? '₹' : '$'}
                            </div>
                            <input
                                type="number"
                                value={newIncome}
                                onChange={(e) => setNewIncome(e.target.value)}
                                className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 text-3xl font-bold text-text placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono"
                                autoFocus
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all"
                    >
                        Update Income
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;
