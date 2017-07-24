import { IWindowService } from 'angular';
import { FeedBack } from './feedback-form/feedback-form.component.controller';
import { FeedBackApiService } from './shared/feedback-api.service';
import { FeedBackType } from './feedback-form/feedback-form.component.controller';
import { TransitionService, ToastService } from '../../../shared/shared.module';

export class TranscolFeedbackController {

    public activePanel: number | undefined = undefined;

    public line: number;

    public static $inject: string[] = [ '$window', 'feedBackApiService', 'transitionService', 'toast', '$mdDialog' ];

    /**
     * Creates an instance of TranscolFeedbackController.
     * @param {IWindowService} $window 
     * @param {FeedBackApiService} feedBackApiService 
     * @param {TransitionService} transitionService 
     * @param {ToastService} toast 
     * @param {angular.material.IDialogService} $mdDialog 
     * @memberof TranscolFeedbackController
     */
    constructor(
        private $window: IWindowService,
        private feedBackApiService: FeedBackApiService,
        private transitionService: TransitionService,
        private toast: ToastService,
        private $mdDialog: angular.material.IDialogService ) {
    }

    /**
     * 
     * 
     * @param {string} url 
     * @memberof TranscolFeedbackController
     */
    public openLink( url: string ): void {
        this.$window.open( url, '_system' );
    }

    /**
     * 
     * 
     * @param {number} type 
     * @memberof TranscolFeedbackController
     */
    public showDetails( type: number ) {
        if ( this.activePanel === type ) {
            this.activePanel = undefined;
        } else {
            this.activePanel = type;
        }
    }


    /**
     * 
     * 
     * @param {any} form 
     * @memberof TranscolFeedbackController
     */
    public saveFeedback( form: FeedBack, type: FeedBackType ) {
        form.type = type;
        this.feedBackApiService
            .saveFeedBack( form )
            .then(() => this.goBack() )
            .then(() => window.setTimeout(() => this.toast.info( { title: 'Mensagem enviada com sucesso' } ), 600 ) );
    }

    public showDialog( message: string ) {
        let alert = this.$mdDialog.alert()
            .clickOutsideToClose( true )
            .textContent( 'Favor preencher todos os campos' )
            .ok( 'ENTENDI' );
        this.$mdDialog.show( alert );
    }

    /**
     * 
     * 
     * @memberof TranscolFeedbackController
     */
    public goBack() {
        this.transitionService.changeState( 'app.transcolOnline' );
    }
}
