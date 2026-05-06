import React from 'react';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';

const StatCard = ({ title, amount, trend, trendLabel, icon: Icon, color = "primary" }) => {
    const isPositive = trend >= 0;
    // Amount is passed as pre-formatted string in dashboard, or number?
    // Dashboard currently passes string "$45,000". 
    // We need to refactor Dashboard to pass raw numbers or handle formatting there.

    return (
        <div className="bg-surface p-6 rounded-2xl border border-border relative group hover:border-text/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl",
                    color === "primary" ? "bg-primary/20 text-primary" :
                        color === "secondary" ? "bg-secondary/20 text-secondary" :
                            "bg-success/20 text-success"
                )}>
                    {Icon && <Icon className="w-6 h-6" />}
                </div>
                <button className="text-muted hover:text-text">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-1">
                <p className="text-muted text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-text truncate w-full" title={amount}>{amount}</h3>
            </div>

            <div className="flex items-center gap-2 mt-4 text-sm">
                <span className={cn("flex items-center gap-1 font-medium",
                    isPositive ? "text-success" : "text-danger"
                )}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(trend)}%
                </span>
                <span className="text-muted/60">{trendLabel}</span>
            </div>
        </div>
    );
};

export default StatCard;
