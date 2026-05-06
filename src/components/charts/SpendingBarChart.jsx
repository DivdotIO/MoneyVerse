import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../../utils/format';
import { useExpenses } from '../../context/ExpenseContext';

const SpendingBarChart = ({ currency = 'USD' }) => {
    const { expenses } = useExpenses();

    // Aggregate expenses by category (title is used as category for now)
    const aggregatedData = expenses.reduce((acc, curr) => {
        const category = curr.title; // Using title as category based on AddExpense form
        const existing = acc.find(item => item.name === category);
        if (existing) {
            existing.amount += Number(curr.amount);
        } else {
            acc.push({ name: category, amount: Number(curr.amount) });
        }
        return acc;
    }, []);

    // Process data: Sort by amount desc, take top 5
    const data = aggregatedData
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    // Identify the max value to highlight or just highlight the first one
    // The design had 'Rent' active. Let's make the highest expense active.
    const maxAmount = Math.max(...data.map(d => d.amount));

    return (
        <div className="bg-surface p-6 rounded-2xl border border-border h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-text">Top 5 Expense Source</h3>
                <button className="text-muted hover:text-text">
                    <span className="sr-only">Options</span>
                    •••
                </button>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={48}>
                        <CartesianGrid vertical={false} stroke="#3f3f46" strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#a1a1aa', fontSize: 12 }}
                            tickFormatter={(value) => {
                                // Simplified formatter: 2k, 2.5k etc.
                                if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
                                return value;
                            }}
                        />
                        <Tooltip
                            cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                            contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                            itemStyle={{ color: 'var(--text)' }}
                            formatter={(value) => [formatCurrency(value, currency), 'Amount']}
                        />
                        <Bar dataKey="amount" radius={[8, 8, 8, 8]}>
                            {data.map((entry, index) => {
                                const colors = ['#7c3aed', '#f97316', '#10b981', '#3b82f6', '#ec4899'];
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[index % colors.length]}
                                    />
                                );
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SpendingBarChart;
