import { IScope } from 'angular';
import { Summary, TransparencyApiService, MoneyFlowController } from '../shared/index';
import { TransitionService } from '../../../shared/index';
import { DateRangeFilter } from '../../../layout/index';

export class ExpensesByOriginController extends MoneyFlowController {

    public static $inject: string[] = [ '$scope', 'transparencyApiService', 'transitionService' ];

    /**
     * Creates an instance of ExpensesByOriginController.
     * 
     * @param {IScope} $scope
     * @param {TransparencyService} transparencyApiService
     * @param {TransitionService} transitionService
     * 
     * @memberOf ExpensesByOriginController
     */
    constructor( $scope: IScope,
        transparencyApiService: TransparencyApiService,
        transitionService: TransitionService ) {
        super( $scope, transparencyApiService, transitionService );
    }

    /**
     * 
     * 
     * @returns {Promise<Summary>}
     * 
     * @memberOf ExpensesController
     */
    public getSummary( filter: DateRangeFilter ): Promise<Summary> {
        return this.transparencyApiService.getExpensesByOrigin( filter );
    }
}
