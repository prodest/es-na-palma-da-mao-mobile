import { IScope } from 'angular';
import { Summary, MoneyFlowDetailController, TransparencyApiService } from '../shared/index';
import { DateRangeFilter } from '../../../layout/index';

export class RevenueDetailController extends MoneyFlowDetailController {

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
     * @returns {Promise<Summary>}
     * 
     * @memberOf RevenueDetailController
     */
    public getSummary( id: string, filter: DateRangeFilter ): Promise<Summary> {
        return this.transparencyApiService.getRevenueDetail( id, filter );
    }
}
