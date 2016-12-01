import { PublicWorksItem } from './public-works-item';

export interface PublicWorks {
    total: number;
    quantity: number;
    items: PublicWorksItem[];
    info: string;
    lastUpdate: string;
};