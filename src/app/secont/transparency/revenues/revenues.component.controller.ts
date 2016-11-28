import { IScope } from 'angular';
import { TransitionService } from '../../../shared/shared.module';
import { DateRangeFilter } from '../../../layout/layout.module';
import { MoneyFlow, MoneyFlowController, TransparencyApiService } from '../shared/index';

export class RevenuesController extends MoneyFlowController<DateRangeFilter> {

    public static $inject: string[] = [ '$scope', 'transparencyApiService', 'transitionService' ];

    /**
     * Creates an instance of RevenuesController.
     * 
     * @param {IScope} $scope
     * @param {TransparencyApiService} transparencyApiService
     * @param {TransitionService} transitionService
     * 
     * @memberOf RevenuesController
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
     * @param {DateRangeFilter} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf RevenuesController
     */
    public getMoneyFlow( filter: DateRangeFilter ): Promise<MoneyFlow> {
        return this.transparencyApiService.getRevenues( filter );
    }
}
