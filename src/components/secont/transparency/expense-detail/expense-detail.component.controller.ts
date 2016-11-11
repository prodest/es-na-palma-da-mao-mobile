import { IScope, IPromise } from 'angular';
import { Summary, MoneyFlowDetailController, TransparencyService } from '../shared/index';
import { DateRangeFilter } from '../../../layout/index';

export class ExpenseDetailController extends MoneyFlowDetailController {

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
     * @param {string} id
     * @param {DateRangeFilter} filter
     * @returns {IPromise<Summary>}
     * 
     * @memberOf ExpenseDetailController
     */
    public getSummary( id: string, filter: DateRangeFilter ): IPromise<Summary> {
        return this.transparencyService.getExpenseDetail( id, filter ).then( summary => this.summary = summary );
    }
}
