import React, { useState } from 'react';
import { Plus, Users, Search, MoreVertical } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useGroups } from '../context/GroupContext';
import { formatCurrency } from '../utils/format';

const Groups = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { currency } = useSettings();
    const { groups, getGroupDetails, addGroup } = useGroups();
    const rate = currency === 'INR' ? 82 : 1;

    const [groupName, setGroupName] = useState('');
    const [groupMembers, setGroupMembers] = useState('');

    const handleCreateGroup = (e) => {
        e.preventDefault();
        if (!groupName.trim()) return;
        addGroup(groupName, groupMembers);
        setGroupName('');
        setGroupMembers('');
        setIsCreateModalOpen(false);
    };

    const displayGroups = groups.map(g => {
        const details = getGroupDetails(g.id);
        return {
            ...g,
            totalExpense: (details?.totalExpense || 0),
            yourShare: (details?.yourShare || 0),
            membersCount: g.members.length
        };
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-text">Your Groups</h2>
                    <p className="text-muted">Manage shared expenses and settlements.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Group</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                    type="text"
                    placeholder="Search groups..."
                    className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 text-text placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-all"
                />
            </div>

            {/* Group List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayGroups.map((group) => (
                    <Link to={`/groups/${group.id}`} key={group.id} className="block group">
                        <div className="bg-surface p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-all relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${group.color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>

                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-xl ${group.color} bg-opacity-20 flex items-center justify-center text-white`}>
                                    <Users className="w-6 h-6" />
                                </div>
                                <button className="text-muted hover:text-text z-10"><MoreVertical className="w-5 h-5" /></button>
                            </div>

                            <h3 className="text-xl font-bold text-text mb-1 group-hover:text-primary transition-colors">{group.name}</h3>
                            <p className="text-muted text-sm mb-6">{group.membersCount} members</p>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-muted mb-1">Total Expense</p>
                                    <p className="font-semibold text-text">{formatCurrency(group.totalExpense, currency)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted mb-1">Your Share</p>
                                    <p className={`font-bold ${group.yourShare > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                        {formatCurrency(group.yourShare, currency)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Create Group Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Group"
            >
                <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Group Name</label>
                        <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="e.g. Summer Trip" className="w-full bg-surface border border-border rounded-xl p-3 text-text focus:outline-none focus:border-primary" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Add Members</label>
                        <textarea value={groupMembers} onChange={(e) => setGroupMembers(e.target.value)} placeholder="Enter names separated by commas (e.g. John, Sarah)" className="w-full bg-surface border border-border rounded-xl p-3 text-text focus:outline-none focus:border-primary h-24 resize-none"></textarea>
                    </div>
                    <div className="pt-2 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-xl text-muted hover:text-text hover:bg-text/5 transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">Create Group</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Groups;
