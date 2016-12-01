import { PublicWorksByCityItem } from './public-works-by-city-item';

export interface PublicWorksByCity {
    city: string;
    total: number;
    items: PublicWorksByCityItem[];
    info: string;
    lastUpdate: string;
};