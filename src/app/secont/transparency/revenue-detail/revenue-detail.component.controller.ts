import { IScope } from 'angular';
import { DateRangeFilter } from '../../../layout/layout.module';
import { MoneyFlow, MoneyFlowDetailController, TransparencyApiService } from '../shared/index';

export class RevenueDetailController extends MoneyFlowDetailController<DateRangeFilter> {

    public static $inject: string[] = [ '$scope', '$stateParams', 'transparencyApiService' ];

    /**
     * Creates an instance of ExpenseDetailController.
     * 
     * @param {IScope} $scope
     * @param {angular.ui.IStateParamsService} $stateParams
     * @param {TransparencyService} transparencyApiService
     * 
     * @memberOf ExpenseDetailController
     */
    constructor( $scope: IScope,
        $stateParams: angular.ui.IStateParamsService,
        transparencyApiService: TransparencyApiService ) {
        super( $scope, $stateParams, transparencyApiService );
    }

    /**
     * 
     * 
     * @param {string} id
     * @param {DateRangeFilter} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf RevenueDetailController
     */
    public getMoneyFlow( id: string, filter: DateRangeFilter ): Promise<MoneyFlow> {
        return this.transparencyApiService.getRevenueDetail( id, filter );
    }
}
