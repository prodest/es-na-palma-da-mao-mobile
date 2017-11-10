import { IComponentController } from 'angular';
import { YearFilter } from './index';

export class YearFilterController implements IComponentController {

    public availableYears: number[];
    public yearRange?: [ number, number ];
    public filter: YearFilter;

    public onChange: ( filter: { filter: YearFilter }) => void;

    /**
     * 
     * 
     * 
     * @memberOf YearFilterController
     */
    public $onInit(): void {
        const currentYear = YearFilter.currentYear().year;
        const range = this.yearRange || [ -10, 0 ];
        this.availableYears = this.generateYears( currentYear + range[ 0 ], currentYear + range[ 1 ] );
    };

    /**
     * 
     * 
     * @param {any} changes
     * 
     * @memberOf YearFilterController
     */
    public $onChanges( changes ) {
        if ( changes.value ) {
            this.filter = angular.copy( changes.value.currentValue );
        }
    };

    /**
     * 
     * 
     * @param {number} selectedYear
     * 
     * @memberOf YearFilterController
     */
    public selectFilter( filter: YearFilter ) {
        this.onChange( { filter: filter });
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
        return ( Array.from( Array( end - start + 1 ).keys() ).map( i => i + start ) ).reverse();
    }
}
