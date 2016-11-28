import { BusLine } from './busLine';

export interface BusSchedule {
    line: BusLine;
    departure: BusDeparture[];
}

export interface BusDeparture {
    terminal: string;
    dayGroups: DayGroups[];
}

export interface DayGroups {
    name: string;
    beginDate: Date;
    times: string[];
}
