import { IScope } from 'angular';
import { Summary, TransparencyApiService, MoneyFlowController } from '../shared/index';
import { TransitionService } from '../../../shared/index';
import { DateRangeFilter } from '../../../layout/index';

export class BudgetsController extends MoneyFlowController {

    public static $inject: string[] = [ '$scope', 'transparencyApiService', 'transitionService' ];

    /**
     * Creates an instance of RevenuesController.
     * 
     * @param {IScope} $scope
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
     * 
     * 
     * @returns {Promise<Summary>}
     * 
     * @memberOf RevenuesController
     */
    public getSummary( filter: DateRangeFilter ): Promise<Summary> {
        return this.transparencyApiService.getBudgets( filter ).then( summary => this.summary = summary );
    }
}
