import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';
import { useExpenses } from '../../context/ExpenseContext';

const ActivityLineChart = ({ currency = 'USD' }) => {
    const { expenses } = useExpenses();

    // Helper to get last 7 days
    const getLast7Days = () => {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates.push(d);
        }
        return dates;
    };

    const last7Days = getLast7Days();

    // Group expenses by date (formatted as 'Day Month', e.g., '1 January')
    // Note: ExpenseContext saves date as "1st January, 2023", which is hard to parse back easily without a library or strict format.
    // However, AddExpense saves it as "2023-01-01" in `date` field? No, `addExpense` formats it immediately.
    // Let's check `ExpenseContext.jsx`.
    // It saves `date: new Date(newExpense.date).toLocaleDateString...`
    // This makes it hard to match. Ideally, we should store the raw date too.
    // BUT, for now, I will try to match based on the formatted string if possible, OR I assume the user adds expenses for "today" mostly.
    // Wait, the `expenses` mock data had formatted dates. The user input is formatted too.
    // I should probably just parse the stored date string back to comparing.
    // OR, simpler: just iterate and sum.

    // Better strategy for this step without refactoring Context:
    // Create a map of "D MMM" keys from the last 7 days.
    // Try to parse the expense.date string to match.
    // The format in Context is: 'day: 'numeric', month: 'long', year: 'numeric'' -> '1 January 2023' (approx).

    // Actually, `addExpense` uses `en-GB`. '1 January 2023'.
    // My chat `getLast7Days` can produce '1 January 2023'.

    const data = last7Days.map(dateObj => {
        const dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        // Format for X-Axis (shorter): 'Jan 1'
        const shortDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        const dailyExpense = expenses
            .filter(e => e.date === dateStr)
            .reduce((sum, e) => sum + Number(e.amount), 0);

        return {
            name: shortDate,
            income: 0, // We don't track daily income yet
            expense: dailyExpense
        };
    });

    return (
        <div className="bg-surface p-6 rounded-2xl border border-border h-[350px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-text">Expense Activity</h3>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span className="text-muted">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-muted">Expense</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="#3f3f46" strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                            formatter={(value) => [formatCurrency(value, currency), 'Amount']}
                        />
                        <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                        <Area type="monotone" dataKey="expense" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ActivityLineChart;
