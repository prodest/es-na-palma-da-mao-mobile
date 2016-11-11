import { DateRangeFilter } from './index';

export class DateRangeFilterController {

    public onChange: ( filter: { filter: DateRangeFilter }) => void;

    constructor() { }

    /**
     * 
     * 
     * @param {{ month: number, year: number }} filter
     * 
     * @memberOf ReportController
     */
    public selectFilter( from: Date, to: Date ) {
        this.onChange( { filter: new DateRangeFilter( from, to ) });
    }
}
