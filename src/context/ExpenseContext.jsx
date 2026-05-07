import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingBag, Wifi, Car } from 'lucide-react';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    // Initial state from localStorage or default empty
    const [expenses, setExpenses] = useState(() => {
        const saved = localStorage.getItem('mv_expenses');
        return saved ? JSON.parse(saved) : [];
    });
    const [income, setIncome] = useState(() => {
        const saved = localStorage.getItem('mv_income');
        return saved ? Number(saved) : 0;
    });

    // Persist expenses and income
    useEffect(() => {
        localStorage.setItem('mv_expenses', JSON.stringify(expenses));
    }, [expenses]);

    useEffect(() => {
        localStorage.setItem('mv_income', income.toString());
    }, [income]);

    const addExpense = (newExpense) => {
        // Create a new expense object
        const expense = {
            id: Date.now(),
            title: newExpense.category || 'Expense',
            date: new Date(newExpense.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            amount: parseFloat(newExpense.amount),
            iconName: 'ShoppingBag', // Default icon for now
        };

        // Add to beginning of list
        setExpenses(prev => [expense, ...prev]);
    };

    const updateIncome = (amount) => {
        setIncome(Number(amount));
    };
    
    const resetData = () => {
        setExpenses([]);
        setIncome(0);
        localStorage.removeItem('mv_expenses');
        localStorage.removeItem('mv_income');
    };

    return (
        <ExpenseContext.Provider value={{ expenses, income, addExpense, updateIncome, resetData }}>
            {children}
        </ExpenseContext.Provider>
    );
};
