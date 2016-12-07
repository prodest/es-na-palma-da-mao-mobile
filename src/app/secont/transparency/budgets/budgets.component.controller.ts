import { IScope } from 'angular';
import { TransitionService } from '../../../shared/shared.module';
import { YearFilter } from '../../../layout/layout.module';
import { MoneyFlow, MoneyFlowController, TransparencyApiService } from '../shared/index';

export class BudgetsController extends MoneyFlowController<YearFilter> {

    public static $inject: string[] = [ '$scope', 'transparencyApiService', 'transitionService' ];

    /**
     * Creates an instance of BudgetsController.
     * 
     * @param {IScope} $scope
     * @param {TransparencyApiService} transparencyApiService
     * @param {TransitionService} transitionService
     * 
     * @memberOf BudgetsController
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
        await this.doFilter( YearFilter.currentYear() );
    }


    /**
     * 
     * 
     * 
     * @memberOf BudgetsController
     */
    public onFiltered(): void {
        this.reportTitle = `Orçado ${this.filter.year}`;
    }

    /**
     * 
     * 
     * @param {YearFilter} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf BudgetsController
     */
    public getMoneyFlow( filter: YearFilter ): Promise<MoneyFlow> {
        return this.transparencyApiService.getBudgets( filter );
    }
}
