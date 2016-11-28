import { BusLine } from './busLine';

export interface BusRoute {
    line: BusLine;
    direction: BusDirection[];
}

export interface BusDirection {
    type: string;
    paths: string[];
}
