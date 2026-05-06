import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, List, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import GroupExpensesList from '../components/groups/GroupExpensesList';
import GroupBalances from '../components/groups/GroupBalances';
import AddGroupExpenseModal from '../components/groups/AddGroupExpenseModal';
import { cn } from '../utils/cn';

const GroupDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('expenses'); // expenses, balances
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/groups" className="p-2 hover:bg-text/5 rounded-xl transition-colors text-muted hover:text-text">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-text">Goa Trip 2024</h2>
                    <p className="text-sm text-muted">5 members • Created Oct 2023</p>
                </div>
                <div className="ml-auto">
                    <button
                        onClick={() => setIsAddExpenseOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Expense</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('expenses')}
                    className={cn("px-6 py-3 font-medium transition-colors border-b-2", activeTab === 'expenses' ? "text-text border-primary" : "text-muted border-transparent hover:text-text")}
                >
                    Expenses
                </button>
                <button
                    onClick={() => setActiveTab('balances')}
                    className={cn("px-6 py-3 font-medium transition-colors border-b-2", activeTab === 'balances' ? "text-text border-primary" : "text-muted border-transparent hover:text-text")}
                >
                    Balances
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'expenses' && <GroupExpensesList />}
                {activeTab === 'balances' && <GroupBalances />}
            </div>

            <AddGroupExpenseModal
                isOpen={isAddExpenseOpen}
                onClose={() => setIsAddExpenseOpen(false)}
            />
        </div>
    );
};

export default GroupDetails;
