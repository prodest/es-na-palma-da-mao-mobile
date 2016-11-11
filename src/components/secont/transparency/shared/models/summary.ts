import { SummaryItem } from './summary-item';

export interface Summary {
    items: SummaryItem[];
    total: number;
    info: string;
    lastUpdate: string;
}
