import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { formatCurrency } from '../../utils/format';

const GroupBalances = () => {
    const { currency } = useSettings();
    const rate = currency === 'INR' ? 82 : 1;

    const settlements = [
        { from: 'Sarah', to: 'You', amount: 150 },
        { from: 'Mike', to: 'John', amount: 85 },
        { from: 'You', to: 'John', amount: 45 },
    ].map(s => ({ ...s, amount: s.amount * rate }));

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text mb-4">Settlements</h3>
            <div className="grid gap-4">
                {settlements.map((settlement, idx) => (
                    <div key={idx} className="bg-surface p-4 rounded-xl border border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold">
                                    {settlement.from.charAt(0)}
                                </div>
                                <span className="text-text font-medium">{settlement.from}</span>
                            </div>

                            <div className="flex flex-col items-center px-4">
                                <span className="text-xs text-muted mb-1">owes</span>
                                <ArrowRight className="w-4 h-4 text-muted" />
                            </div>

                            <div className="flex items/-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs font-bold">
                                    {settlement.to.charAt(0)}
                                </div>
                                <span className="text-text font-medium">{settlement.to}</span>
                            </div>
                        </div>

                        <div className="font-bold text-lg text-primary">
                            {formatCurrency(settlement.amount, currency)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Settle Up Button */}
            <div className="mt-8 flex justify-end">
                <button className="bg-text text-surface px-6 py-2 rounded-xl font-bold hover:bg-text/90 transition-colors">
                    Settle Up
                </button>
            </div>
        </div>
    );
};

export default GroupBalances;
