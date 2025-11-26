import React from 'react';
import { PlanResult, PlanType } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ComparisonTableProps {
  results: PlanResult[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ results }) => {
  const getPlanResult = (type: PlanType) => results.find(r => r.type === type)!;

  const bestPlan = results.find(r => r.isBestValue);
  // Sort by cost descending to find worst for savings comparison
  const worstPlan = [...results].sort((a, b) => b.costs.netCost - a.costs.netCost)[0];
  
  // Calculate savings only if best plan exists
  const savings = bestPlan && worstPlan ? worstPlan.costs.netCost - bestPlan.costs.netCost : 0;

  const plans = [PlanType.VIRTUAL, PlanType.PRO, PlanType.PREMIUM];

  const rows = [
    { label: 'Opening Fee', key: 'openingFee' as const },
    { label: 'Monthly Fees (Yearly)', key: 'monthlyAdminFeeTotal' as const },
    { label: 'Annual Admin Fee', key: 'annualAdminFee' as const },
    { label: 'Card Fees', key: 'cardFees' as const },
    { label: 'Deposit Fees', key: 'depositFees' as const },
    { label: 'Transfer Fees', key: 'transferFees' as const },
  ];

  return (
    <div className="bg-navy-800 border border-white/5 rounded-2xl p-6 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-6">
        <h3 className="text-xl font-display font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-brand-primary rounded-full"></span>
          Detailed Plan Comparison
        </h3>
        {/* Recommendation Text */}
        {bestPlan && (
          <p className="text-sm text-brand-secondary mt-2 font-display">
            Based on your deposit and usage, the <strong className="text-brand-accent uppercase">{bestPlan.type}</strong> plan is your best option. 
            You save <span className="text-white font-bold">{formatCurrency(savings)}</span> per year compared to the {worstPlan.type} plan.
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="py-4 px-4 text-sm font-medium text-text-muted bg-navy-900 rounded-tl-xl border-b border-white/5 font-display w-1/4">Feature / Cost</th>
              {plans.map(planType => {
                 const result = getPlanResult(planType);
                 const isBest = result.isBestValue;
                 
                 let headerColor = 'text-white';
                 if (planType === PlanType.PREMIUM) headerColor = 'text-brand-accent';
                 if (planType === PlanType.PRO) headerColor = 'text-brand-primary';
                 if (planType === PlanType.VIRTUAL) headerColor = 'text-brand-secondary';

                 const bgClass = isBest ? 'bg-brand-accent/10' : 'bg-navy-900';
                 const borderClass = isBest ? 'border-t-2 border-t-brand-accent' : 'border-b border-white/5';

                 return (
                  <th key={planType} className={`py-4 px-4 text-center min-w-[140px] ${bgClass} ${borderClass} ${planType === PlanType.PREMIUM ? (isBest ? '' : 'rounded-tr-xl') : ''}`}>
                    <span className={`text-lg font-display font-bold block ${headerColor}`}>{planType}</span>
                    {isBest && <span className="text-[10px] uppercase tracking-wider text-navy-900 font-bold bg-brand-accent px-2 py-0.5 rounded-full inline-block mt-2 shadow-[0_0_10px_rgba(240,197,86,0.3)]">Best Value</span>}
                  </th>
                 );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr key={row.key} className="hover:bg-white/5 transition-colors group">
                <td className="py-4 px-4 text-sm text-gray-300 font-medium group-hover:text-white transition-colors font-display bg-navy-900/50">{row.label}</td>
                {plans.map(planType => {
                  const result = getPlanResult(planType);
                  const val = result.costs[row.key];
                  const isBest = result.isBestValue;
                  const cellBg = isBest ? 'bg-brand-accent/5' : '';

                  return (
                    <td key={planType} className={`py-4 px-4 text-center text-sm text-text-muted group-hover:text-white transition-colors font-mono ${cellBg}`}>
                      {val === 0 ? <span className="text-gray-600">-</span> : formatCurrency(val)}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Total Fees Subtotal */}
             <tr className="bg-navy-900 font-semibold border-t-2 border-white/5">
                <td className="py-4 px-4 text-sm text-white font-display">Total Fees (1st Year)</td>
                {plans.map(planType => {
                  const result = getPlanResult(planType);
                  const isBest = result.isBestValue;
                  const cellBg = isBest ? 'bg-brand-accent/10' : '';
                  return (
                    <td key={planType} className={`py-4 px-4 text-center text-white font-mono ${cellBg}`}>
                      {formatCurrency(result.costs.totalFirstYearCost)}
                    </td>
                  );
                })}
            </tr>

            {/* Interest */}
            <tr className="hover:bg-brand-primary/5 transition-colors border-t border-white/5">
                <td className="py-4 px-4 text-sm text-brand-primary font-medium font-display bg-navy-900/50">Interest Earned</td>
                {plans.map(planType => {
                   const result = getPlanResult(planType);
                   const val = result.costs.interestEarned;
                   const isBest = result.isBestValue;
                   const cellBg = isBest ? 'bg-brand-accent/5' : '';
                   return (
                    <td key={planType} className={`py-4 px-4 text-center text-sm font-medium text-brand-primary font-mono ${cellBg}`}>
                      {val > 0 ? `+${formatCurrency(val)}` : <span className="text-gray-600">-</span>}
                    </td>
                   );
                })}
            </tr>

             {/* Net Cost Final */}
             <tr className="bg-navy-900 border-t border-white/10">
                <td className="py-6 px-4 text-base text-white font-bold font-display">Estimated Net Cost</td>
                {plans.map(planType => {
                   const result = getPlanResult(planType);
                   const isNegative = result.costs.netCost < 0; // Profit
                   const isBest = result.isBestValue;
                   const cellBg = isBest ? 'bg-brand-accent/10 ring-1 ring-inset ring-brand-accent/30' : '';
                   
                   return (
                    <td key={planType} className={`py-6 px-4 text-center text-lg font-bold font-display ${cellBg} ${isBest ? 'text-brand-accent scale-105 transform' : 'text-white'}`}>
                      <span className={isNegative ? 'text-brand-primary' : ''}>
                        {formatCurrency(result.costs.netCost)}
                      </span>
                      {isNegative && <div className="text-[10px] text-brand-primary font-bold uppercase mt-1 tracking-wider">Net Profit</div>}
                    </td>
                   );
                })}
            </tr>

            {/* Savings Row */}
            <tr className="bg-navy-900 border-t border-white/10">
                <td className="py-4 px-4 text-sm text-brand-secondary font-medium font-display">Potential Savings</td>
                {plans.map(planType => {
                   const result = getPlanResult(planType);
                   const isBest = result.isBestValue;
                   const cellBg = isBest ? 'bg-brand-accent/10' : '';
                   
                   return (
                    <td key={planType} className={`py-4 px-4 text-center text-sm font-bold font-mono ${cellBg}`}>
                       {isBest ? (
                         <span className="text-brand-accent">{formatCurrency(result.savingsVsMostExpensive)}</span>
                       ) : (
                         <span className="text-gray-600 text-xs">--</span>
                       )}
                    </td>
                   );
                })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;