import { BudgetDeviationItem } from './budget-deviation-item';

export interface BudgetDeviation {
    expected: number;
    executed: number;
    percentage: number;
    info: string;
    items: BudgetDeviationItem[];
    lastUpdate: string;
} 