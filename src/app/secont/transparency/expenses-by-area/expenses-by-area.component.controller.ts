import { IScope } from 'angular';
import { TransitionService } from '../../../shared/shared.module';
import { DateRangeFilter } from '../../../layout/layout.module';
import { MoneyFlow, MoneyFlowController, TransparencyApiService } from '../shared/index';

export class ExpensesByAreaController extends MoneyFlowController<DateRangeFilter> {

    public static $inject: string[] = [ '$scope', 'transparencyApiService', 'transitionService', '$timeout' ];

    /**
     * Creates an instance of ExpensesByAreaController.
     * 
     * @param {IScope} $scope
     * @param {TransparencyApiService} transparencyApiService
     * @param {TransitionService} transitionService
     * @param {ITimeoutService} $timeout
     * 
     * @memberOf ExpensesByAreaController
     */
    constructor( $scope: IScope,
        transparencyApiService: TransparencyApiService,
        transitionService: TransitionService ) {
        super( $scope, transparencyApiService, transitionService );
    }

    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public async activate() {
        await this.doFilter( DateRangeFilter.currentYear() );
    }

    /**
     * 
     * 
     * 
     * @memberOf ExpensesByAreaController
     */
    public onFiltered(): void {
        this.reportTitle = `Despesas ${this.filter.description()}`;
    }

    /**
     * 
     * 
     * @param {DateRangeFilter} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf ExpensesByAreaController
     */
    public getMoneyFlow( filter: DateRangeFilter ): Promise<MoneyFlow> {
        return this.transparencyApiService.getExpensesByArea( filter );
    }
}
