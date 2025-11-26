import { CalculatorState, PlanType } from './types';

export const INITIAL_STATE: CalculatorState = {
  selectedPlan: PlanType.VIRTUAL,
  initialDeposit: 1000,
  monthlyDeposit: 0,
  depositType: 'fiat',
  virtualCards: 1,
  metalCards: 0,
  monthlyExternalTransfers: 0,
};

export const SCENARIOS = {
  NEW_USER: {
    selectedPlan: PlanType.VIRTUAL,
    initialDeposit: 1000,
    monthlyDeposit: 0,
    depositType: 'fiat',
    virtualCards: 1,
    metalCards: 0,
    monthlyExternalTransfers: 100,
  } as CalculatorState,
  REGULAR: {
    selectedPlan: PlanType.PRO,
    initialDeposit: 5000,
    monthlyDeposit: 1000,
    depositType: 'fiat',
    virtualCards: 2,
    metalCards: 0,
    monthlyExternalTransfers: 500,
  } as CalculatorState,
  HEAVY_TRADER: {
    selectedPlan: PlanType.PRO,
    initialDeposit: 25000,
    monthlyDeposit: 5000,
    depositType: 'crypto',
    virtualCards: 5,
    metalCards: 0, // Assuming mainly digital use
    monthlyExternalTransfers: 2000,
  } as CalculatorState,
  PREMIUM_USER: {
    selectedPlan: PlanType.PREMIUM,
    initialDeposit: 50000,
    monthlyDeposit: 2000,
    depositType: 'fiat',
    virtualCards: 2,
    metalCards: 1,
    monthlyExternalTransfers: 5000,
  } as CalculatorState,
};

// Fee Structures
export const FEES = {
  [PlanType.VIRTUAL]: {
    opening: 0,
    monthly: 5,
    annual: 0,
    card: 3, // per card
    metalCard: 0, // N/A
    depositRate: 0.04,
    transferRate: 0.035,
    interestRate: 0.00,
  },
  [PlanType.PRO]: {
    opening: 300,
    monthly: 2,
    annual: 80,
    card: 3,
    metalCard: 0, // N/A usually, but keeping structure
    depositRate: 0.03,
    transferRate: 0.025,
    interestRate: 0.007,
  },
  [PlanType.PREMIUM]: {
    opening: 750,
    monthly: 0,
    annual: 750,
    card: 3, // virtual
    metalCard: 170, // metal
    depositRate: 0.025,
    transferRate: 0.02,
    interestRate: 0.015,
  },
};