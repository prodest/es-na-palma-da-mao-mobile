import ionic from 'ionic';
import { NlElements } from './nl-elements.factory';
import { NlConfig } from './nl-config.factory';

export class NlFab {

    public static $inject: string[] = [ '$nlConfig', '$nlElements' ];


    constructor( private nlConfig: NlConfig, private nlElements: NlElements ) {
        // this.init();
    }

    public openned: boolean = false;

    public init() {
        this.nlElements.actionPanel = document.getElementById( 'nlActionButton' );
        // this.nlElements.actionPanelH = new Hammer( this.nlElements.actionPanel );
        this.nlElements.actionPlus = document.getElementById( 'nlPlus' );
        // this.nlElements.actionPlusH = new Hammer( this.nlElements.actionPlus );

        let myGesture = window.ionic.onGesture( 'tap', ( ev ) => {
            if ( !this.nlElements.actionPlus.hasAttribute( 'ng-click' ) ) {
                this.toggle();
            }
        }, this.nlElements.actionPanel, {});
    }

    public toggle( hide?) {
        // action button
        // used only if enabled in setting when initializing
        if ( this.nlConfig.options.actionButton ) {
            this.nlElements.drawerDimm.style.transition = 'all ' + this.nlConfig.options.speed + 's ' + this.nlConfig.options.animation;
            if ( !this.active && !hide ) {
                this.active = true;
                if ( this.nlConfig.options.burger && this.nlConfig.options.burger.use ) {
                    this.nlElements.burger.style[ 'z-index' ] = '1104';
                }
                this.nlElements.actionPlus.style[ 'z-index' ] = '1106';
                this.nlElements.actionPanel.classList.add( 'active' );
                setTimeout( function () {
                    this.nlElements.drawerDimm.style.visibility = 'visible';
                    this.nlElements.drawerDimm.style.opacity = '1';
                }, 100 );
            } else {
                this.active = false;
                if ( this.nlConfig.options.burger && this.nlConfig.options.burger.use ) {
                    this.nlElements.burger.style[ 'z-index' ] = '1106';
                }
                this.nlElements.drawerDimm.style.visibility = 'hidden';
                this.nlElements.drawerDimm.style.opacity = '0';
                this.nlElements.actionPlus.style[ 'z-index' ] = '1104';
                this.nlElements.actionPanel.classList.remove( 'active' );
            }
        }
    }
}