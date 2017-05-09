// import { BusStop } from './bus-stop';

export interface FavoriteStops {
    id: number;
    items: { stop: number, type: FavoriteLocation }[];
    date: Date;
}


export type FavoriteLocation = 'casa' | 'trabalho' | 'escola' | 'outros';
