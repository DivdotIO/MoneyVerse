import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Tag, FileText, Check } from 'lucide-react'; // Removed DollarSign to use text symbol
import { useSettings } from '../context/SettingsContext';
import { useExpenses } from '../context/ExpenseContext';

const AddExpense = () => {
    const navigate = useNavigate();
    const { addExpense } = useExpenses();
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        date: new Date().toLocaleDateString('en-CA'), // formatted as YYYY-MM-DD in local time
        note: ''
    });

    const { currency } = useSettings();
    const currencySymbol = currency === 'INR' ? '₹' : '$';

    const categories = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other'];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Expense Added:', formData, 'Currency:', currency);
        addExpense(formData);
        alert(`Expense Added: ${currencySymbol}${formData.amount}`);
        navigate('/');
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-10">
            <h2 className="text-2xl font-bold text-text mb-6">Add New Expense</h2>

            <div className="bg-surface p-8 rounded-3xl border border-border shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Amount Input */}
                    <div>
                        <label className="block text-sm font-medium text-muted mb-2">Amount</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-muted font-bold text-xl group-focus-within:text-primary transition-colors">
                                {currencySymbol}
                            </div>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 text-3xl font-bold text-text placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-muted mb-2">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                <input
                                    type="text"
                                    list="category-suggestions"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Category (e.g. Food)"
                                    className="w-full bg-surface border border-border rounded-xl py-3.5 pl-12 pr-4 text-text placeholder:text-muted/30 focus:outline-none focus:border-primary/50 transition-all"
                                />
                                <datalist id="category-suggestions">
                                    {categories.map(c => <option key={c} value={c} />)}
                                </datalist>
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-muted mb-2">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-surface border border-border rounded-xl py-3.5 pl-12 pr-4 text-text focus:outline-none focus:border-primary/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-muted mb-2">Note (Optional)</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-4 w-5 h-5 text-muted" />
                            <textarea
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                placeholder="What was this for?"
                                className="w-full bg-surface border border-border rounded-xl py-3.5 pl-12 pr-4 text-text focus:outline-none focus:border-primary/50 min-h-[120px] resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-violet-600 hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Check className="w-5 h-5" />
                        <span>Save Expense</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;
