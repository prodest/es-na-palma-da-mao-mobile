import { MoneyFlowItem } from './money-flow-item';

export interface MoneyFlow {
    items: MoneyFlowItem[];
    total: number;
    info: string;
    lastUpdate: string;
}
