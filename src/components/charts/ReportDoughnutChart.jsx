import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';
import { useExpenses } from '../../context/ExpenseContext';

const ReportDoughnutChart = ({ currency = 'USD' }) => {
    const { expenses, income } = useExpenses();

    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const savings = income - totalExpense;

    const data = [
        { name: 'Income', value: income },
        { name: 'Expense', value: totalExpense },
        { name: 'Savings', value: savings > 0 ? savings : 0 },
    ];

    // Calculate percentage used (Expense / Income)
    const percentage = income > 0 ? Math.round((totalExpense / income) * 100) : 0;

    const COLORS = ['#10b981', '#7c3aed', '#f97316'];

    return (
        <div className="bg-surface p-6 rounded-2xl border border-border h-full min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-text">Report Overview</h3>
                <button className="text-muted hover:text-text">•••</button>
            </div>

            <div className="flex-1 flex flex-col gap-6 items-center justify-center">
                <div className="w-[200px] h-[200px] relative flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={65}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                                formatter={(value) => [formatCurrency(value, currency), 'Amount']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-3xl font-bold text-text">{percentage}%</span>
                        <span className="text-sm text-muted">Used</span>
                    </div>
                </div>

                <div className="w-full space-y-3">
                    {data.map((item, index) => (
                        <div key={item.name} className="flex justify-between items-center text-sm group">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                <span className="text-muted font-medium group-hover:text-text transition-colors">{item.name}</span>
                            </div>
                            <span className="font-semibold text-text truncate max-w-[120px]" title={formatCurrency(item.value, currency)}>
                                {formatCurrency(item.value, currency)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportDoughnutChart;
