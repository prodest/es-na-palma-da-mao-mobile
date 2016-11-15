import { IScope } from 'angular';
import { Summary, MoneyFlowController, TransparencyApiService } from '../shared/index';
import { TransitionService } from '../../../shared/index';
import { DateRangeFilter } from '../../../layout/index';

export class ExpensesByAreaController extends MoneyFlowController {

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
        return this.transparencyApiService.getExpensesByArea( filter );
    }
}
