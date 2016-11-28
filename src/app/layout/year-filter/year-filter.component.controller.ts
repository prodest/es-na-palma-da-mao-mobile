import { YearFilter } from './index';

export class YearFilterController {

    public availableYears: number[];

    public onChange: ( filter: { filter: YearFilter }) => void;

    /**
     * Creates an instance of YearFilterController.
     * 
     * 
     * @memberOf YearFilterController
     */
    constructor() {
        const currentYear = YearFilter.currentYear().year;
        this.availableYears = this.generateYears( currentYear - 10, currentYear );
    }

    /**
     * 
     * 
     * @param {number} year
     * 
     * @memberOf YearFilterController
     */
    public selectFilter( year: number ) {
        this.onChange( { filter: new YearFilter( year ) });
    }


    /**
     * 
     * 
     * @private
     * @param {any} start
     * @param {any} end
     * @returns
     * 
     * @memberOf YearFilterController
     */
    private generateYears( start, end ) {
        return ( Array.from( Array( end - start + 1 ).keys() ).map( i => i + start ) );
    }
}
