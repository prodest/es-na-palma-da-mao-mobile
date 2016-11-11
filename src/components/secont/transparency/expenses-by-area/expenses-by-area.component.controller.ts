import { IScope, IPromise } from 'angular';
import { Summary, MoneyFlowController, TransparencyService } from '../shared/index';
import { TransitionService } from '../../../shared/index';
import { DateRangeFilter } from '../../../layout/index';

export class ExpensesByAreaController extends MoneyFlowController {

    public static $inject: string[] = [ '$scope', 'transparencyService', 'transitionService' ];

    /**
     * Creates an instance of ExpensesByOriginController.
     * 
     * @param {IScope} $scope
     * @param {TransparencyService} transparencyService
     * @param {TransitionService} transitionService
     * 
     * @memberOf ExpensesByOriginController
     */
    constructor( $scope: IScope,
                 transparencyService: TransparencyService,
                 transitionService: TransitionService ) {
        super( $scope, transparencyService, transitionService );
    }

    /**
     * 
     * 
     * @returns {Promise<Summary>}
     * 
     * @memberOf ExpensesController
     */
    public getSummary( filter: DateRangeFilter ): IPromise<Summary> {
        return this.transparencyService.getExpensesByArea( filter ).then( summary => this.summary = summary );
    }
}
