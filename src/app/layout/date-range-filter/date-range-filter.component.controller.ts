import { IComponentController } from 'angular';
import { DateRangeFilter } from './index';

export class DateRangeFilterController implements IComponentController {

    public filter: DateRangeFilter | undefined;

    public onChange: ( filter: { filter: DateRangeFilter }) => void;


    /**
     * 
     * 
     * @param {any} changes
     * 
     * @memberOf DateRangeFilterController
     */
    public $onChanges( changes ) {
        if ( changes.value ) {
            this.filter = angular.copy( changes.value.currentValue );
        }
    };

    /**
     * 
     * 
     * @param {{ month: number, year: number }} filter
     * 
     * @memberOf ReportController
     */
    public selectFilter( filter: DateRangeFilter ) {
        this.onChange( { filter: filter });
    }
}
