import { PublicWorksByCityItem } from './public-works-by-city-item';

export interface PublicWorksByCity {
    total: number;
    quantity: number;
    items: PublicWorksByCityItem[];
    info: string;
    lastUpdate: string;
};