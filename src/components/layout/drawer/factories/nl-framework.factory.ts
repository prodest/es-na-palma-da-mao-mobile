import Hammer from 'hammerjs';
import { NlElements } from './nl-elements.factory';
import { NlBurger } from './nl-burguer.factory';
import { NlHelpers } from './nl-helpers.factory';
import { NlConfig } from './nl-config.factory';
import { NlFab } from './nl-fab.factory';
import { NlDrawer } from './nl-drawer.factory';
import { NlRefresh } from './nl-refresh.factory';
import { NlToast } from './nl-toast.factory';
import { NlMenu } from './nl-menu.factory';

export class NlFramework {
    constructor( public config: NlConfig,
        public drawer: NlDrawer,
        public burger: NlBurger,
        public refresh: NlRefresh,
        public toast: NlToast,
        public menu: NlMenu,
        public fab: NlFab,
        private nlHelpers: NlHelpers,
        private nlElements: NlElements ) {
        this.init( this.config );
    }

    public init( config ) {
        this.set( config );
        // find device width and height
        this.config.deviceW = Math.max( document.documentElement.clientWidth, window.innerWidth || 0 );
        this.config.deviceH = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );
        // get body reference
        this.nlElements.body = document.body;
        this.nlElements.bodyH = new Hammer( this.nlElements.body );
        // add burger menu icon
        if ( config.burger && config.burger.use ) {
            this.burger.init();
        }
        // add dimmer
        document.body.insertAdjacentHTML( 'beforeend', '<div id="nlDimm"></div>' );
        this.nlElements.drawerDimm = document.getElementById( 'nlDimm' );
        this.nlElements.drawerDimmH = new Hammer( this.nlElements.drawerDimm );
        // add toast refresh
        if ( config.refresh ) {
            this.refresh.init();
        }
        // add swipe element
        if ( config.drawer ) {
            document.body.insertAdjacentHTML( 'beforeend', '<div id="nlSwipe"></div>' );
            this.drawer.init( config.drawer );
        }
        // add toast container
        if ( config.toast ) {
            document.body.insertAdjacentHTML( 'beforeend', '<div id="nlToast"></div>' );
            this.toast.init();
        }
        // add toast container
        if ( config.secMenu ) {
            this.menu.init();
        }
        // add toast container
        if ( config.actionButton ) {
            this.fab.init();
        }

        // modify view-content?
        if ( config.content && config.content.modify ) {
            this.nlElements.viewContent = document.getElementById( 'nlContent' );
            this.nlElements.viewContentH = new Hammer( this.nlElements.viewContent );
            this.nlElements.viewContent.style[ 'margin-top' ] = this.config.options.content.topBarHeight + 'px';
            this.nlElements.viewContent.style[ 'min-height' ] = this.config.deviceH - this.config.options.content.topBarHeight + 'px';
            this.nlElements.viewContent.style.width = this.config.deviceW + 'px';
        };
        // listen to resize event, mainly for updating size of drawer when changing view portrait <-> landscape
        window.onresize = ( event ) => {
            this.config.deviceW = Math.max( document.documentElement.clientWidth, window.innerWidth || 0 );
            this.config.deviceH = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );
            if ( config.content && config.content.modify ) {
                this.nlElements.viewContent.style.width = this.config.deviceW + 'px';
                this.nlElements.viewContent.style[ 'min-height' ] = this.config.deviceH - this.config.options.content.topBarHeight + 'px';
            }
            if ( config.drawer ) {
                if ( !this.drawer.openned ) {
                    this.nlHelpers.translate( this.nlElements.drawer, this.config.maxWidth, '-', 0, '', 0, '', this.config.maxWidth );
                } else {
                    this.nlHelpers.translate( this.nlElements.drawer, 0, '', 0, '', 0, '', this.config.maxWidth );
                }
            }
        };
    }

    public set( config ) {
        let oldOptions = this.config.options;
        this.config.options = this.nlHelpers.merge( oldOptions, config );
        console.info( '%c[≡]%c nlFramework: new settings set', 'color: #333;', 'color: #558844;' );
        console.info( '%c[≡]', 'color: #333;', this.config.options );
    }
}
