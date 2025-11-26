import React from 'react';
import { PlanResult, PlanType } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Shield, Zap, Crown, Info, Landmark } from 'lucide-react';

interface PlanCardProps {
  result: PlanResult;
}

const PlanCard: React.FC<PlanCardProps> = ({ result }) => {
  const { type, costs, isBestValue } = result;

  // Plan Specific styling updated for Nummus Brand Guidelines
  // Premium: Gold (#F0C556)
  // Pro: Turquoise (#00A79D)
  // Virtual: Silver/Light Green (#68ACA8)
  const getPlanStyles = () => {
    switch (type) {
      case PlanType.VIRTUAL:
        return {
          icon: <Zap className="w-8 h-8 text-brand-secondary" />,
          gradient: 'from-brand-secondary/10 to-navy-900',
          border: 'border-brand-secondary/20',
          titleColor: 'text-brand-secondary',
          bg: 'bg-navy-800'
        };
      case PlanType.PRO:
        return {
          icon: <Shield className="w-8 h-8 text-brand-primary" />,
          gradient: 'from-brand-primary/10 to-navy-900',
          border: 'border-brand-primary/20',
          titleColor: 'text-brand-primary',
          bg: 'bg-navy-800'
        };
      case PlanType.PREMIUM:
        return {
          icon: <Crown className="w-8 h-8 text-brand-accent" />,
          gradient: 'from-brand-accent/10 to-navy-900',
          border: 'border-brand-accent/30',
          titleColor: 'text-brand-accent',
          bg: 'bg-navy-800' // Keeping consistent dark bg
        };
    }
  };

  const styles = getPlanStyles();

  return (
    <div className={`relative flex flex-col h-full ${styles.bg} backdrop-blur-xl border ${styles.border} rounded-2xl overflow-hidden shadow-2xl transition-all duration-500`}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-40 pointer-events-none`} />

      {/* Header Section */}
      <div className="p-8 relative z-10 border-b border-white/5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-navy-900 rounded-2xl border border-white/10 shadow-inner">
              {styles.icon}
            </div>
            <div>
              <h3 className={`text-3xl font-display font-bold ${styles.titleColor}`}>{type} Plan</h3>
              <p className="text-text-muted text-sm mt-1">Fee Statement Preview</p>
            </div>
          </div>
          {isBestValue && (
             <div className="bg-brand-accent text-navy-900 border border-brand-accent px-4 py-1.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(240,197,86,0.3)] animate-bounce-subtle font-display">
               Best Value
             </div>
          )}
        </div>

        <div className="mt-8">
           <p className="text-text-muted text-sm font-medium uppercase tracking-wider mb-2 font-display">Estimated 1st Year Net Cost</p>
           <div className="flex items-end gap-3">
             <span className={`text-5xl font-bold font-display ${costs.netCost < 0 ? 'text-brand-primary' : 'text-white'}`}>
              {formatCurrency(costs.netCost)}
             </span>
             {costs.netCost < 0 && (
               <span className="text-sm text-brand-primary font-bold mb-3 bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20">
                 PROFIT
               </span>
             )}
           </div>
           <p className="text-xs text-text-muted mt-2">
             Total Cost calculated as Fees minus Interest Earned.
           </p>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="p-8 relative z-10 space-y-6 flex-1">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2 font-display">
          <Info className="w-4 h-4 text-brand-secondary" /> Cost Breakdown
        </h4>

        <div className="space-y-5">
          {/* Administrative */}
          <div className="group">
             <div className="flex justify-between items-center mb-1">
               <span className="text-gray-300 font-medium font-display">Administrative Fees</span>
               <span className="text-white font-semibold">
                 {formatCurrency(costs.openingFee + costs.annualAdminFee + costs.monthlyAdminFeeTotal)}
               </span>
             </div>
             <div className="h-1.5 w-full bg-navy-900 rounded-full overflow-hidden border border-white/5">
               <div className="h-full bg-gray-500 w-full opacity-60"></div>
             </div>
             <div className="flex gap-4 text-xs text-text-muted mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Opening: {formatCurrency(costs.openingFee)}</span>
                <span>Annual: {formatCurrency(costs.annualAdminFee)}</span>
                <span>Monthly: {formatCurrency(costs.monthlyAdminFeeTotal)}</span>
             </div>
          </div>

          {/* Transactional */}
          <div className="group">
             <div className="flex justify-between items-center mb-1">
               <span className="text-gray-300 font-medium font-display">Transaction Fees</span>
               <span className="text-white font-semibold">
                 {formatCurrency(costs.depositFees + costs.transferFees)}
               </span>
             </div>
             <div className="h-1.5 w-full bg-navy-900 rounded-full overflow-hidden border border-white/5">
               <div className="h-full bg-brand-secondary w-full opacity-80"></div>
             </div>
             <div className="flex gap-4 text-xs text-text-muted mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Deposits: {formatCurrency(costs.depositFees)}</span>
                <span>Transfers: {formatCurrency(costs.transferFees)}</span>
             </div>
          </div>

          {/* Cards */}
          <div className="group">
             <div className="flex justify-between items-center mb-1">
               <span className="text-gray-300 font-medium font-display">Card Fees</span>
               <span className="text-white font-semibold">
                 {formatCurrency(costs.cardFees)}
               </span>
             </div>
             <div className="h-1.5 w-full bg-navy-900 rounded-full overflow-hidden border border-white/5">
               <div className="h-full bg-brand-primary w-full opacity-80"></div>
             </div>
          </div>
        </div>

        {/* Interest Section */}
        <div className="mt-8 p-4 bg-navy-900/50 border border-brand-primary/20 rounded-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
           <div className="flex justify-between items-center relative z-10">
             <div className="flex items-center gap-2">
               <Landmark className="w-5 h-5 text-brand-primary" />
               <span className="text-brand-primary font-medium font-display">Interest Earned</span>
             </div>
             <span className="text-xl font-bold text-brand-primary font-display">
               +{formatCurrency(costs.interestEarned)}
             </span>
           </div>
           {result.type === PlanType.VIRTUAL && (
             <p className="text-xs text-brand-secondary/70 mt-2">
               Note: Virtual plan does not accrue interest. Upgrade to Pro or Premium to earn.
             </p>
           )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-8 py-4 bg-navy-900/80 border-t border-white/5 text-xs text-text-muted flex justify-between items-center">
        <span>* Estimations based on provided usage</span>
        <span className="font-mono opacity-50">NUMMUS-CALC</span>
      </div>
    </div>
  );
};

export default PlanCard;