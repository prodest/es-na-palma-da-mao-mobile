import { IScope, IPromise } from 'angular';
import { Summary, TransparencyService, MoneyFlowController } from '../shared/index';
import { TransitionService } from '../../../shared/index';
import { DateRangeFilter } from '../../../layout/index';

export class RevenuesController extends MoneyFlowController {

    public static $inject: string[] = [ '$scope', 'transparencyService', 'transitionService' ];

    /**
     * Creates an instance of RevenuesController.
     * 
     * @param {IScope} $scope
     * @param {TransitionService} transitionService
     * 
     * @memberOf RevenuesController
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
     * @memberOf RevenuesController
     */
    public getSummary( filter: DateRangeFilter ): IPromise<Summary> {
        return this.transparencyService.getRevenues( filter ).then( summary => this.summary = summary );
    }
}
