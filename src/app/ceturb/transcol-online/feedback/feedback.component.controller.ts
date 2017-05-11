import { IWindowService } from 'angular';

export class TranscolFeedbackController {

    public activePanel: number | undefined = undefined;

    public line: number;

    public static $inject: string[] = [ '$window' ];

    constructor( private $window: IWindowService ) {
    }

    public openLink( url: string ): void {
        this.$window.open( url, '_system' );
    }

    public showDetails( type: number ) {
        if ( this.activePanel === type ) {
            this.activePanel = undefined;
        } else {
            this.activePanel = type;
        }
    }
}
