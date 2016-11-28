import moment = require( 'moment' );

export class DateRangeFilter {

    public from: Date;
    public to: Date;

    /**
     * Creates an instance of DateRangeFilter.
     * 
     * @param {Date} from
     * @param {Date} to
     * 
     * @memberOf DateRangeFilter
     */
    constructor( from: Date, to: Date ) {
        this.from = moment( from ).startOf( 'month' ).toDate();
        this.to = moment( to ).endOf( 'month' ).toDate();
    }

    /**
     * 
     * 
     * @static
     * @returns
     * 
     * @memberOf DateRangeFilter
     */
    public static currentYear() {
        return new DateRangeFilter( moment().startOf( 'year' ).toDate(), moment().endOf( 'month' ).toDate() );
    }

    /**
     * 
     * 
     * @returns
     * 
     * @memberOf DateRangeFilter
     */
    public description() {
        const fromMonth = moment( this.from ).format( 'MMMM' );
        const fromYear = moment( this.from ).year();
        const toMonth = moment( this.to ).format( 'MMMM' );
        const toYear = moment( this.to ).year();

        // mês e ano iguais
        let desc = `${toMonth} de ${toYear}`;

        // anos diferentes
        if ( fromYear !== toYear ) {
            desc = `${fromMonth} de ${fromYear} a ${toMonth} de ${toYear}`;
        }
        // mesmo ano e meses diferentes
        else if ( fromMonth !== toMonth ) {
            desc = `${fromMonth} a ${toMonth} de ${toYear}`;
        }
        return desc;
    }
}