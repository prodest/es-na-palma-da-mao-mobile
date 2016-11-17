import ionic from 'ionic';
import { NlElements } from './nl-elements.factory';
import { NlBurger } from './nl-burguer.factory';
import { NlHelpers } from './nl-helpers.factory';
import { NlConfig } from './nl-config.factory';
import { NlFab } from './nl-fab.factory';

export class NlDrawer {

    public static $inject: string[] = [ '$nlElements', '$nlBurger', '$nlHelpers', '$nlConfig', '$nlFab' ];

    constructor( private nlElements: NlElements, private nlBurger: NlBurger, private nlHelpers: NlHelpers, private nlConfig: NlConfig, private nlFab: NlFab ) {
        this.init( this.nlConfig );
    }

    public init( config ) {
        if ( config.openCb ) { this.on.show = config.openCb; };
        if ( config.closeCb ) { this.on.hide = config.closeCb; };
        // get options passed from initialization and merge them with default ones
        this.nlConfig = this.nlHelpers.merge( this.nlConfig, config );
        // get references to all needed elements on page
        this.nlElements.swipe = document.getElementById( 'nlSwipe' );
        // this.nlElements.swipeH = new Hammer( this.nlElements.swipe );
        this.nlElements.drawer = document.getElementById( 'nlDrawer' );
        // this.nlElements.drawerH = new Hammer( this.nlElements.drawer );
        this.nlElements.drawerDimm = document.getElementById( 'nlDimm' );
        // this.nlElements.drawerDimmH = new Hammer( this.nlElements.drawerDimm );
        // get device width and height for proper scaling of drawer
        this.nlConfig.deviceW = Math.max( document.documentElement.clientWidth, window.innerWidth || 0 );
        this.nlConfig.deviceH = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );
        // set initial styles (position and size)
        this.nlConfig.maxWidth = config.options.drawer.maxWidth > this.nlConfig.deviceW - 56 ? this.nlConfig.deviceW - 56 : this.nlConfig.options.drawer.maxWidth;
        this.nlHelpers.translate( this.nlElements.drawer, this.nlConfig.maxWidth, '-', 0, '', 0, '', this.nlConfig.maxWidth );
        // listen for pan and tap events on elements
        window.ionic.onGesture( 'panleft panright', ( ev ) => { if ( this.openned ) { this.move( ev, true ); } }, this.nlElements.drawer );

        window.ionic.onGesture( 'panleft panright', ( ev ) => { if ( this.openned ) { this.move( ev ); } }, this.nlElements.drawerDimm );

        window.ionic.onGesture( 'panleft panright', ( ev ) => this.move( ev ), this.nlElements.swipe );

        window.ionic.onGesture( 'tap', ( ev ) => this.hide(), this.nlElements.drawer );

        window.ionic.onGesture( 'tap', this.hide(), this.nlElements.drawerDimm );

        if ( this.nlConfig.options.burger ) {
            if ( this.nlConfig.options.burger.use ) {
                window.ionic.onGesture( 'tap', ( ev ) => {
                    if ( !this.nlElements.burger.hasAttribute( 'ng-click' ) ) {
                        this.toggle();
                    }
                }, this.nlElements.burger );
            }
        }
        // register touch end listeners
        this.touchEnd( this.nlElements.swipe );
        this.touchEnd( this.nlElements.drawer );
        this.touchEnd( this.nlElements.drawerDimm );
    }

    public on = {
        show: function () { },
        hide: function () { }
    }

    public show() {
        // show drawer with animation
        this.nlElements.drawer.style.transition = 'all ' + this.nlConfig.options.speed + 's ' + this.nlConfig.options.animation;
        this.nlConfig.maxWidth = this.nlConfig.options.drawer.maxWidth > this.nlConfig.deviceW - 56 ? this.nlConfig.deviceW - 56 : this.nlConfig.options.drawer.maxWidth;
        this.nlHelpers.translate( this.nlElements.drawer, 0, '', 0, '', 0, '', this.nlConfig.maxWidth );
        // dimm background
        this.nlElements.drawerDimm.style.transition = 'all ' + this.nlConfig.options.speed + 's ' + this.nlConfig.options.animation;
        this.nlElements.drawerDimm.style.visibility = 'visible';
        this.nlElements.drawerDimm.style.opacity = '1';
        // set open state and toggle burger
        this.openned = true;
        this.nlConfig.options.reverse = true;
        if ( this.nlConfig.options.burger && this.nlConfig.options.burger.use ) {
            this.nlBurger.toggle( true );
        };
        setTimeout( () => {
            this.on.show();
        }, this.nlConfig.options.speed * 1000 );
    }

    public hide() {
        // hide drawer
        this.nlElements.drawer.style.transition = 'all ' + this.nlConfig.options.speed + 's ' + this.nlConfig.options.animation;
        this.nlHelpers.translate( this.nlElements.drawer, this.nlConfig.maxWidth, '-', 0, '', 0, '' );
        // dimm background
        this.nlElements.drawerDimm.style.transition = 'all ' + this.nlConfig.options.speed + 's ' + this.nlConfig.options.animation;
        this.nlElements.drawerDimm.style.visibility = 'hidden';
        this.nlElements.drawerDimm.style.opacity = '0';
        // toggle burger
        if ( this.nlConfig.options.burger && this.nlConfig.options.burger.use ) {
            this.nlBurger.toggle( false );
        }
        // set open state
        this.nlFab.toggle( true );
        this.openned = false;
        setTimeout( () => {
            this.on.hide();
        }, this.nlConfig.options.speed * 1000 );
    }

    public toggle() {
        // alert('drawer.toggle()!');
        if ( this.openned ) {
            this.hide();
        } else {
            this.show();
        }
    }

    public move( ev, hold?) {
        // check for direction
        this.nlConfig.options.direction = ev.type === 'panleft' ? 'left' : 'right';
        // figure out position, depending on wheter we are holding drawer itself somwhere in the middle
        // or just the edge
        let pos = ev.center.x - this.nlConfig.maxWidth;
        if ( hold ) {
            this.nlConfig.options.holdPos = this.nlConfig.options.holdPos ? this.nlConfig.options.holdPos : pos;
            pos = pos + Math.abs( this.nlConfig.options.holdPos );
        };
        pos = pos < 0 ? pos : 0;
        // calculate opacity of background dimmer based on touch position (within max width range 0-100%)
        let opacityModder = this.nlConfig.options.drawer.maxWidth - Math.abs( pos );
        let opacity = ( opacityModder / ( this.nlConfig.options.drawer.maxWidth / 100 ) / 100 ).toFixed( 2 );
        opacity = opacity < 1 ? opacity : 1;
        // animate burger menu icon
        if ( this.nlConfig.options.burger.use ) {
            this.nlBurger.animate( pos );
        }
        // dimm background
        this.nlElements.drawerDimm.style.transition = 'none';
        this.nlElements.drawerDimm.style.visibility = 'visible';
        this.nlElements.drawerDimm.style.opacity = opacity;
        // this.nlElements.drawerDimm.style.webkitTransform = 'translate(0,0) translateZ(0)';
        // move the drawer
        this.nlElements.drawer.style.transition = 'none';
        this.nlConfig.maxWidth = this.nlConfig.options.drawer.maxWidth > this.nlConfig.deviceW - 56 ? this.nlConfig.deviceW - 56 : this.nlConfig.options.drawer.maxWidth;
        this.nlHelpers.translate( this.nlElements.drawer, pos, '', 0, '', 0, '', this.nlConfig.maxWidth );
        // if this is final touch (mouse move) event
        // show or hide the drawer (pannig left = open, right = close)
        // and clean our temp values
        if ( ev.isFinal ) {
            if ( this.nlConfig.options.direction === 'left' ) {
                this.hide();
            } else if ( this.nlConfig.options.direction === 'right' ) {
                this.show();
            } else {
                this.onEnd( ev, false );
            }
            this.nlConfig.options.holdPos = undefined;
            this.nlConfig.options.endTrue = false;
        } else {
            this.nlConfig.options.endTrue = true;
        }
    }

    public touchEnd( element ) {
        // listen for touch end event on touch devices
        this.nlConfig.onTouch = 'ontouchstart' in window ? true : false;
        if ( this.nlConfig.onTouch ) {
            element.addEventListener( 'touchend', function ( e ) {
                this.onEnd( e, true );
            }, false );
        } else {
            element.addEventListener( 'mouseup', function ( e ) {
                this.onEnd( e, false );
            }, false );
        };
    }

    public onEnd( e, touch ) {
        // get the touch reference
        // reference first touch point for this event
        let touchobj = touch ? e.changedTouches[ 0 ] : e;
        // if the drawer is pulled more than 50% of its maxWidth
        let isBigger = touchobj.clientX > ( this.nlConfig.options.drawer.maxWidth / 2 );
        // combined with the direction
        let isLeft = this.nlConfig.options.direction === 'left';
        let isRight = this.nlConfig.options.direction === 'right';
        let endTrue = this.nlConfig.options.endTrue;
        // decide if show or hide the drawer
        if ( ( isBigger && isLeft && endTrue ) || ( isBigger && isRight && endTrue ) ) {
            this.show();
        } else if ( ( !isBigger && isLeft && endTrue ) || ( !isBigger && isRight && endTrue ) ) {
            this.hide();
        }
        // clean up our temp variables
        this.nlConfig.options.direction = false;
        this.nlConfig.options.endTrue = false;
        this.nlConfig.options.holdPos = undefined;
        e.preventDefault();
    }
}