import React, { useState } from 'react';
import { DollarSign, Users } from 'lucide-react';
import Modal from '../ui/Modal';
import { cn } from '../../utils/cn';
import { useSettings } from '../../context/SettingsContext';
import { useGroups } from '../../context/GroupContext';

const AddGroupExpenseModal = ({ isOpen, onClose, groupId }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [splitType, setSplitType] = useState('equal'); // equal, exact, percent

    const { currency } = useSettings();
    const { addGroupExpense, getGroupDetails } = useGroups();
    const currencySymbol = currency === 'INR' ? '₹' : '$';
    const group = getGroupDetails(groupId);
    const members = group?.members || [];

    const handleSubmit = () => {
        if (!amount || !description) return;
        const expenseData = {
            description,
            amount,
            paidBy: 'You',
            category: 'Food',
            splitType
        };
        addGroupExpense(groupId, expenseData);
        setAmount('');
        setDescription('');
        onClose();
    };

    const splitOptions = [
        { id: 'equal', label: 'Equal' },
        { id: 'exact', label: 'Exact Amount' },
        { id: 'percent', label: 'Percentage' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Group Expense">
            <div className="space-y-6">
                {/* Amount and Desc */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-muted mb-1 block">Description</label>
                        <input
                            type="text"
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Dinner"
                            className="w-full bg-surface border border-border rounded-xl p-3 text-text focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted mb-1 block">Amount</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-muted font-bold">
                                {currencySymbol}
                            </div>
                            <input
                                type="number"
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-surface border border-border rounded-xl p-3 pl-10 text-text focus:outline-none focus:border-primary font-mono text-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Split Type Selector */}
                <div>
                    <label className="text-sm text-muted mb-2 block">Split Method</label>
                    <div className="flex bg-surface p-1 rounded-xl border border-border">
                        {splitOptions.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSplitType(opt.id)}
                                className={cn(
                                    "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                                    splitType === opt.id
                                        ? "bg-primary text-white shadow-md"
                                        : "text-muted hover:text-text hover:bg-text/5"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Split Details Placeholder */}
                <div className="bg-surface/50 border border-border rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-text">Split Details</span>
                        <span className="text-xs text-muted">Total: {currencySymbol}{amount || 0}</span>
                    </div>

                    {/* Mock Members List */}
                    <div className="space-y-3">
                        {members.map((member) => (
                            <div key={member} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                                        {member.charAt(0)}
                                    </div>
                                    <span className="text-sm text-muted">{member}</span>
                                </div>
                                {splitType === 'equal' && (
                                    <span className="text-sm text-text">{currencySymbol}{amount ? (amount / members.length).toFixed(2) : '0.00'}</span>
                                )}
                                {splitType !== 'equal' && (
                                    <input
                                        type="number"
                                        placeholder={splitType === 'percent' ? '%' : currencySymbol}
                                        className="w-20 bg-surface border border-border rounded-lg p-1 text-right text-sm text-text focus:outline-none focus:border-primary"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button onClick={handleSubmit} className="w-full bg-primary py-3 rounded-xl font-bold text-white hover:bg-primary/90 transition-colors">
                    Add Expense
                </button>
            </div>
        </Modal>
    );
};

export default AddGroupExpenseModal;
