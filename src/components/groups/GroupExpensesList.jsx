import React from 'react';
import { ShoppingCart, Utensils, Plane } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useGroups } from '../../context/GroupContext';
import { formatCurrency } from '../../utils/format';

const GroupExpensesList = ({ groupId }) => {
    const { currency } = useSettings();
    const { getGroupDetails } = useGroups();
    const rate = currency === 'INR' ? 82 : 1;
    
    const group = getGroupDetails(groupId);
    const expenses = (group?.expenses || []).map(e => ({
        ...e,
        amount: parseFloat(e.amount)
    }));

    return (
        <div className="space-y-4">
            {expenses.map((expense) => (
                <div key={expense.id} className="bg-surface p-4 rounded-xl border border-border flex items-center justify-between hover:bg-text/5 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-text/5 rounded-full text-muted">
                            {expense.category === 'Food' && <Utensils className="w-5 h-5" />}
                            {expense.category === 'Travel' && <Plane className="w-5 h-5" />}
                            {expense.category === 'Shopping' && <ShoppingCart className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="text-text font-medium">{expense.description}</p>
                            <p className="text-xs text-muted">Paid by <span className="text-text">{expense.paidBy}</span> • {expense.date}</p>
                        </div>
                    </div>

                    <div className="text-right min-w-0 flex-shrink-0 ml-2">
                        <p className="text-text font-bold truncate max-w-[120px]">{formatCurrency(expense.amount, currency)}</p>
                        <p className="text-xs text-muted truncate max-w-[120px]">You owe {expense.paidBy === 'You' ? 0 : formatCurrency(expense.amount / (group?.members.length || 1), currency)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GroupExpensesList;
