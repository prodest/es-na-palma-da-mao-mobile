import moment = require( 'moment' );

export class YearFilter {

    public year: number;

    /**
     * Creates an instance of YearFilter.
     * 
     * @param {number} year
     * 
     * @memberOf YearFilter
     */
    constructor( year: number ) {
        this.year = year;
    }

    /**
     * 
     * 
     * @static
     * @returns
     * 
     * @memberOf YearFilter
     */
    public static currentYear(): YearFilter {
        return new YearFilter( moment().year() );
    }

    /**
     * 
     * 
     * @returns
     * 
     * @memberOf YearFilter
     */
    public description() {
        return `Ano de ${this.year}`;
    }
}