import { NlElements } from './nl-elements.factory';
import { NlConfig } from './nl-config.factory';
import { NlHelpers } from './nl-helpers.factory';

export class NlToast {

    public static $inject: string[] = [ '$nlConfig', '$nlHelpers', '$nlElements' ];


    constructor( private nlConfig: NlConfig, private nlHelpers: NlHelpers, private nlElements: NlElements ) {
        // this.init( this.nlConfig );
    }

    public init( config ) {
        // get options passed from initialization and merge them with default ones
        this.nlConfig.options = this.nlHelpers.merge( this.nlConfig.options, config );
        // get references to all needed elements on page
        this.nlElements.toast = document.getElementById( 'nlToast' );
        // this.nlElements.toastH = new Hammer( this.nlElements.toast );
        // listen for pan events on elements
        window.ionic.onGesture( 'panleft panright', ( ev ) => this.move( ev ), this.nlElements.toast );
        
        // register touch end listeners
        this.touchEnd( this.nlElements.toast );
    }

    public show( options ) {
        let title = options.title || 'I\'m a Toast! Yummy!';
        let position = options.position || undefined;
        let trueCb = options.trueCallback;
        let falseCb = options.falseCallback;
        let timeout = options.timeout;
        if ( this.nlConfig.runnigTimeout ) { clearTimeout( this.nlConfig.runnigTimeout ); };

        if ( position === 'top' ) {
            this.nlElements.toast.style.top = '75px';
            this.nlElements.toast.style.bottom = 'auto';
        } else {
            this.nlElements.toast.style.top = '';
            this.nlElements.toast.style.bottom = '1rem';
        }

        if ( typeof trueCb === 'function' ) {
            this.trueCb = trueCb;
        } else {
            this.trueCb = function () { };
        }

        if ( typeof falseCb === 'function' ) {
            this.falseCb = falseCb;
        } else {
            this.falseCb = function () { };
        }

        if ( title ) { this.nlElements.toast.innerHTML = title; };

        if ( position === 'top' ) {
            this.nlElements.toast.style.transition = 'none';
            this.nlHelpers.translate( this.nlElements.toast, 0, '', this.nlConfig.deviceH, '-', 0, '' );
        } else {
            this.nlElements.toast.style.transition = 'none';
            this.nlHelpers.translate( this.nlElements.toast, 0, '', this.nlConfig.deviceH, '', 0, '' );
        }
        setTimeout( function () {
            this.nlElements.toast.style.transition = 'all ' + this.nlConfig.options.speed / 2 + 's ' + this.nlConfig.options.animation;
            this.nlHelpers.translate( this.nlElements.toast, 0, '', 0, '', 0, '' );
        }, 100 );
        if ( timeout ) {
            this.nlConfig.runnigTimeout = setTimeout( function () {
                this.hide( true );
            }, timeout );
        }
    }

    public center() {
        this.nlElements.toast.style.transition = 'all ' + this.nlConfig.options.speed / 2 + 's ' + this.nlConfig.options.animation;
        this.nlHelpers.translate( this.nlElements.toast, 0, '', 0, '', 0, '' );
    }

    public right() {
        this.trueCb();
        this.nlElements.toast.style.transition = 'all ' + this.nlConfig.options.speed / 2 + 's ' + this.nlConfig.options.animation;
        this.nlHelpers.translate( this.nlElements.toast, this.nlConfig.deviceW, '', 0, '', 0, '' );
        setTimeout( function () {
            this.hide();
        }, this.nlConfig.options.speed / 2 * 1000 );
    }

    public left() {
        this.falseCb();
        this.nlElements.toast.style.transition = 'all ' + this.nlConfig.options.speed / 2 + 's ' + this.nlConfig.options.animation;
        this.nlHelpers.translate( this.nlElements.toast, this.nlConfig.deviceW, '-', 0, '', 0, '' );
        setTimeout( function () {
            this.hide();
        }, this.nlConfig.options.speed / 2 * 1000 );
    }

    public hide( transitions ) {
        if ( transitions ) {
            this.nlElements.toast.style.transition = 'all ' + this.nlConfig.options.speed + 's ' + this.nlConfig.options.animation;
        } else {
            this.nlElements.toast.style.transition = 'none';
        }
        setTimeout( function () {
            this.nlHelpers.translate( this.nlElements.toast, 0, '', this.nlConfig.deviceH, '', 0, '' );
        }, 100 );
    }

    public move( ev ) {
        this.nlElements.toast.style.transition = 'none';
        this.direction = ev.type === 'panleft' ? 'left' : 'right';
        let pos = ev.center.x - this.nlConfig.deviceW;
        this.holdPos = this.holdPos ? this.holdPos : pos;
        pos = pos + Math.abs( this.holdPos );
        this.nlHelpers.translate( this.nlElements.toast, pos, '', 0, '', 0 );
        if ( ev.isFinal ) {
            if ( this.direction === 'left' ) {
                this.left();
            } else {
                this.right();
            }
            this.holdPos = undefined;
            this.endTrue = false;
        } else {
            this.endTrue = true;
        }
    }

    public touchEnd( element ) {
        let onEnd = function ( e, touch ) {
            let touchobj = touch ? e.changedTouches[ 0 ] : e;
            let endTrue = this.endTrue;
            if ( endTrue ) { this.center(); }
            // clean up temp variables
            this.direction = false;
            this.endTrue = false;
            this.holdPos = undefined;
            e.preventDefault();
        };

        // listen for touch end event on touch devices
        this.nlConfig.onTouch = 'ontouchstart' in window ? true : false;
        if ( this.nlConfig.onTouch ) {
            element.addEventListener( 'touchend', function ( e ) {
                onEnd( e, true );
            }, false );
        } else {
            element.addEventListener( 'mouseup', function ( e ) {
                onEnd( e, false );
            }, false );
        };
    }

    public trueCb() {
        console.log( 'True Callback' );
    }

    public falseCb() {
        console.log( 'False Callback' );
    }
}