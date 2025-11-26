import { CalculatorState, PlanResult, PlanType, PlanCosts } from '../types';
import { FEES } from '../constants';

export const calculatePlanCosts = (state: CalculatorState, planType: PlanType): PlanCosts => {
  const fees = FEES[planType];
  
  // 1. Admin Fees
  const openingFee = fees.opening;
  const annualAdminFee = fees.annual;
  const monthlyAdminFeeTotal = fees.monthly * 12;

  // 2. Card Fees
  // Virtual cards cost logic
  const virtualCardCost = state.virtualCards * fees.card;
  // Metal cards only apply cost if Plan is Premium, otherwise treated as standard or invalid
  // Assuming if user selects metal cards on non-premium, we might ignore or charge standard. 
  // Sticking strictly to prompt: Premium: $170/metal card.
  const metalCardCost = planType === PlanType.PREMIUM ? state.metalCards * fees.metalCard : 0;
  
  const cardFees = virtualCardCost + metalCardCost;

  // 3. Deposit Fees
  // Applied to Initial Deposit + (Monthly * 12)
  const totalAnnualDeposit = state.initialDeposit + (state.monthlyDeposit * 12);
  const depositFees = totalAnnualDeposit * fees.depositRate;

  // 4. Transfer Fees
  // Applied to External Transfers
  const totalAnnualTransfers = state.monthlyExternalTransfers * 12;
  const transferFees = totalAnnualTransfers * fees.transferRate;

  // 5. Interest Earned
  // Approximating Average Balance: Initial + (Total Annual Deposits / 2) - (Total Annual Transfers / 2)
  // To keep it positive and simple: Average Balance = Initial + (Monthly Net Flow * 6)
  // If net flow is negative, balance decreases.
  const netMonthlyFlow = state.monthlyDeposit - state.monthlyExternalTransfers;
  let averageBalance = state.initialDeposit + (netMonthlyFlow * 6);
  if (averageBalance < 0) averageBalance = 0; // Cap at 0

  const interestEarned = averageBalance * fees.interestRate;

  // Total
  const totalFirstYearCost = openingFee + annualAdminFee + monthlyAdminFeeTotal + cardFees + depositFees + transferFees;
  const netCost = totalFirstYearCost - interestEarned;

  return {
    openingFee,
    annualAdminFee,
    monthlyAdminFeeTotal,
    cardFees,
    depositFees,
    transferFees,
    totalFirstYearCost,
    interestEarned,
    netCost
  };
};

export const calculateAllPlans = (state: CalculatorState): PlanResult[] => {
  const plans = [PlanType.VIRTUAL, PlanType.PRO, PlanType.PREMIUM];
  
  const results = plans.map(plan => ({
    type: plan,
    costs: calculatePlanCosts(state, plan),
    isBestValue: false,
    savingsVsMostExpensive: 0,
  }));

  // Determine Best Value (Lowest Net Cost)
  // Note: Net Cost can be negative (Profit), so we look for the minimum algebraic value
  const sortedByCost = [...results].sort((a, b) => a.costs.netCost - b.costs.netCost);
  const bestPlanType = sortedByCost[0].type;
  const mostExpensiveCost = sortedByCost[sortedByCost.length - 1].costs.netCost;

  return results.map(r => ({
    ...r,
    isBestValue: r.type === bestPlanType,
    savingsVsMostExpensive: mostExpensiveCost - r.costs.netCost
  }));
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};