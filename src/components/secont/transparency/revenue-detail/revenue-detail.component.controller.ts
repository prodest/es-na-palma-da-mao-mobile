import { IScope, IPromise } from 'angular';
import { Summary, MoneyFlowDetailController, TransparencyService } from '../shared/index';
import { DateRangeFilter } from '../../../layout/index';

export class RevenueDetailController extends MoneyFlowDetailController {

    public static $inject: string[] = [ '$scope', '$stateParams', 'transparencyService' ];

    /**
     * Creates an instance of ExpenseDetailController.
     * 
     * @param {IScope} $scope
     * @param {angular.ui.IStateParamsService} $stateParams
     * @param {TransparencyService} transparencyService
     * 
     * @memberOf ExpenseDetailController
     */
    constructor( $scope: IScope,
                 $stateParams: angular.ui.IStateParamsService,
                 transparencyService: TransparencyService ) {
        super( $scope, $stateParams, transparencyService );
    }

    /**
     * 
     * 
     * @returns {Promise<Summary>}
     * 
     * @memberOf revenuesController
     */
    public getSummary( id: string, filter: DateRangeFilter ): IPromise<Summary> {
        return this.transparencyService.getRevenueDetail( id, filter ).then( summary => this.summary = summary );
    }
}
