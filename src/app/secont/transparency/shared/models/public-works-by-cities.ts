import { PublicWorksByCitiesItem } from './public-works-by-cities-item';

export interface PublicWorksByCities {
    total: number;
    quantity: number;
    items: PublicWorksByCitiesItem[];
    info: string;
    lastUpdate: string;
};