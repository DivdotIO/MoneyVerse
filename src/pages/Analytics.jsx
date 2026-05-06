import React from 'react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { useSettings } from '../context/SettingsContext';
import { formatCurrency } from '../utils/format';

const Analytics = () => {
    const { currency } = useSettings();
    const rate = currency === 'INR' ? 82 : 1;

    // Mock Data
    const monthlyData = [
        { name: 'Jan', income: 1200, expense: 800 },
        { name: 'Feb', income: 1100, expense: 750 },
        { name: 'Mar', income: 1300, expense: 950 },
        { name: 'Apr', income: 1250, expense: 820 },
        { name: 'May', income: 1150, expense: 880 },
        { name: 'Jun', income: 1400, expense: 790 },
    ].map(item => ({
        ...item,
        income: item.income * rate,
        expense: item.expense * rate
    }));

    const categoryData = [
        { name: 'Food', value: 150 },
        { name: 'Travel', value: 80 },
        { name: 'Rent', value: 450 },
        { name: 'Shopping', value: 100 },
    ].map(item => ({ ...item, value: item.value * rate }));

    const COLORS = ['#7c3aed', '#f97316', '#10b981', '#ef4444'];

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <h2 className="text-2xl font-bold text-text mb-6">Financial Analytics</h2>

            {/* Row 1: Income vs Expense Trend (Area) */}
            <div className="bg-surface p-6 rounded-2xl border border-border h-[400px]">
                <h3 className="text-lg font-bold text-text mb-6">Income vs Expense Trend</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={monthlyData}>
                        <defs>
                            <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#a1a1aa" />
                        <YAxis stroke="#a1a1aa" tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                            formatter={(value) => [formatCurrency(value, currency), 'Amount']}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" />
                        <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExp)" />
                    </AreaChart>
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
                            <Bar dataKey="income" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Savings" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
