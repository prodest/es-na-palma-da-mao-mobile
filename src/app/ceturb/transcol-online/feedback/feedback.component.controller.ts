import { IWindowService } from 'angular';
import { FeedBack } from './feedback-form/feedback-form.component.controller';
import { FeedBackApiService } from './shared/feedback-api.service';
import { FeedBackType } from './feedback-form/feedback-form.component.controller';
import { TransitionService, ToastService } from '../../../shared/shared.module';

export class TranscolFeedbackController {

    public activePanel: number | undefined = undefined;

    public line: number;

    public static $inject: string[] = [ '$window', 'feedBackApiService', 'transitionService', 'toast' ];

    /**
     * Creates an instance of TranscolFeedbackController.
     * @param {IWindowService} $window 
     * @memberof TranscolFeedbackController
     */
    constructor(
        private $window: IWindowService,
        private feedBackApiService: FeedBackApiService,
        private transitionService: TransitionService,
        private toast: ToastService ) {
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
            .then(() => window.setTimeout( () => this.toast.info( { title: 'Mensagem enviada com sucesso' }), 600 ) );
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
