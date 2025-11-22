
export interface FinancialPremises {
  referenceMonth: string; // format YYYY-MM
  fixedCostPct: number; // Essencial
  variableCostPct: number; // Necessário
  proLaborePct: number; // Bom
  profitGoalPct: number; // Lucro Almejado (Meta)
  monthlyRevenueGoal: number; // Faturamento Meta em R$
}

export interface DailySale {
  id: string;
  day: number;
  value: number;
}

export const DEFAULT_PREMISES: FinancialPremises = {
  referenceMonth: new Date().toISOString().slice(0, 7),
  fixedCostPct: 25,
  variableCostPct: 45,
  proLaborePct: 10,
  profitGoalPct: 20,
  monthlyRevenueGoal: 100000,
};

export enum SliceColor {
  ESSENCIAL = '#ef4444', // Red-500
  NECESSARIO = '#eab308', // Yellow-500
  BOM = '#3b82f6', // Blue-500
  OTIMO = '#22c55e', // Green-500
}
