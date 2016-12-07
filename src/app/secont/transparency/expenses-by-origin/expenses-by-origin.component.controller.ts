import { IScope } from 'angular';
import { TransitionService } from '../../../shared/shared.module';
import { DateRangeFilter } from '../../../layout/layout.module';
import { MoneyFlow, MoneyFlowController, TransparencyApiService } from '../shared/index';

export class ExpensesByOriginController extends MoneyFlowController<DateRangeFilter> {

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
     * @memberOf ExpensesByOriginController
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
     * @memberOf ExpensesByOriginController
     */
    public getMoneyFlow( filter: DateRangeFilter ): Promise<MoneyFlow> {
        return this.transparencyApiService.getExpensesByOrigin( filter );
    }
}
