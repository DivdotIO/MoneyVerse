import React from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { useSettings } from '../context/SettingsContext';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/format';

const Analytics = () => {
    const { currency } = useSettings();
    const { expenses, income } = useExpenses();
    const rate = currency === 'INR' ? 82 : 1;

    // Calculate dynamic monthly data starting from January (first 6 months)
    const generateMonthlyData = () => {
        const data = [];
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < 6; i++) {
            const d = new Date(currentYear, i, 1);
            const monthNameShort = d.toLocaleDateString('en-GB', { month: 'short' }); 
            const monthNameLong = d.toLocaleDateString('en-GB', { month: 'long' });

            const monthExpenses = expenses.filter(e => e.date.includes(`${monthNameLong} ${currentYear}`) || e.date.includes(`${monthNameLong}, ${currentYear}`));
            const monthExpenseTotal = monthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

            data.push({
                name: monthNameShort,
                income: income, 
                expense: monthExpenseTotal,
                savings: income - monthExpenseTotal
            });
        }
        return data;
    };

    const monthlyData = generateMonthlyData();

    // Generate dynamic category data for PieChart
    const aggregatedData = expenses.reduce((acc, curr) => {
        const category = curr.title;
        const existing = acc.find(item => item.name === category);
        if (existing) {
            existing.value += Number(curr.amount);
        } else {
            acc.push({ name: category, value: Number(curr.amount) });
        }
        return acc;
    }, []);

    const categoryData = aggregatedData.length > 0 ? aggregatedData : [
        { name: 'Food', value: 150 * rate },
        { name: 'Travel', value: 80 * rate },
        { name: 'Rent', value: 450 * rate },
        { name: 'Shopping', value: 100 * rate },
    ];

    const COLORS = ['#7c3aed', '#f97316', '#10b981', '#ef4444', '#3b82f6'];

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <h2 className="text-2xl font-bold text-text mb-6">Financial Analytics</h2>

            {/* Row 1: Income vs Expense Trend (Line) */}
            <div className="bg-surface p-6 rounded-2xl border border-border h-[400px]">
                <h3 className="text-lg font-bold text-text mb-6">Income vs Expense Trend</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#a1a1aa" />
                        <YAxis stroke="#a1a1aa" tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                            formatter={(value) => [formatCurrency(value, currency), 'Amount']}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Row 2 Col 1: Category Distribution (Pie) */}
                <div className="bg-surface p-6 rounded-2xl border border-border h-[350px]">
                    <h3 className="text-lg font-bold text-text mb-6">Spending by Category</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                formatter={(value) => [formatCurrency(value, currency), 'Amount']}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Row 2 Col 2: Net Savings (Bar) */}
                <div className="bg-surface p-6 rounded-2xl border border-border h-[350px]">
                    <h3 className="text-lg font-bold text-text mb-6">Monthly Savings</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.3} />
                            <XAxis dataKey="name" stroke="#a1a1aa" />
                            <YAxis stroke="#a1a1aa" tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                                formatter={(value) => [formatCurrency(value, currency), 'Savings']}
                            />
                            <Bar dataKey="savings" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Savings" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
