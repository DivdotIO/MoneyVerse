import React, { createContext, useContext, useState, useEffect } from 'react';

const GroupContext = createContext();

export const useGroups = () => useContext(GroupContext);

export const GroupProvider = ({ children }) => {
    const [groups, setGroups] = useState(() => {
        const saved = localStorage.getItem('mv_groups');
        return saved ? JSON.parse(saved) : [];
    });

    const [groupExpenses, setGroupExpenses] = useState(() => {
        const saved = localStorage.getItem('mv_group_expenses');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('mv_groups', JSON.stringify(groups));
    }, [groups]);

    useEffect(() => {
        localStorage.setItem('mv_group_expenses', JSON.stringify(groupExpenses));
    }, [groupExpenses]);

    const addGroup = (name, membersList) => {
        const colors = ['bg-purple-500', 'bg-orange-500', 'bg-emerald-500', 'bg-blue-500', 'bg-pink-500'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const newGroup = {
            id: Date.now().toString(),
            name,
            members: ['You', ...membersList.split(',').map(m => m.trim()).filter(m => m)],
            color: randomColor,
            createdAt: new Date().toISOString()
        };
        setGroups(prev => [...prev, newGroup]);
    };

    const addGroupExpense = (groupId, expenseData) => {
        const newExpense = {
            id: Date.now().toString(),
            groupId,
            ...expenseData,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        };
        setGroupExpenses(prev => [...prev, newExpense]);
    };

    const getGroupDetails = (groupId) => {
        const group = groups.find(g => g.id === groupId);
        if (!group) return null;

        const expenses = groupExpenses.filter(e => e.groupId === groupId);
        const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
        
        let yourShare = 0;
        expenses.forEach(exp => {
            if (exp.splits && exp.splits['You']) {
                 yourShare += exp.splits['You'];
            } else if (exp.splitType === 'equal') {
                 yourShare += parseFloat(exp.amount) / group.members.length;
            } else {
                 yourShare += parseFloat(exp.amount) / group.members.length; // Default to equal
            }
        });

        return {
            ...group,
            totalExpense,
            yourShare,
            expenses
        };
    };

    return (
        <GroupContext.Provider value={{ groups, groupExpenses, addGroup, addGroupExpense, getGroupDetails }}>
            {children}
        </GroupContext.Provider>
    );
};
