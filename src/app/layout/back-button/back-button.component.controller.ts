import { IComponentController } from 'angular';
import { TransitionService } from '../../shared/shared.module';

export class BackButtonController implements IComponentController {

    public static $inject: string[] = [ 'transitionService' ];

    /**
     * Creates an instance of BackButtonController.
     * 
     * @param {TransitionService} transitionService
     * 
     * @memberOf BackButtonController
     */
    constructor( private transitionService: TransitionService ) { }

    /**
     * 
     * 
     * 
     * @memberOf BackButtonController
     */
    public goBack(): void {
        this.transitionService.goBack();
    }
}
