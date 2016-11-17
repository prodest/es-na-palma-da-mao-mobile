import ionic from 'ionic';
import { NlElements } from './nl-elements.factory';
import { NlConfig } from './nl-config.factory';
import { NlHelpers } from './nl-helpers.factory';

export class NlRefresh {

    public static $inject: string[] = [ '$nlConfig', '$nlHelpers', '$nlElements' ];

    constructor( private nlConfig: NlConfig, private nlHelpers: NlHelpers, private nlElements: NlElements ) {
        this.init();
    }

    public init() {
        // are we on touch device?
        this.nlConfig.onTouch = 'ontouchstart' in window ? true : false;
        // get references to elements

        document.body.insertAdjacentHTML( 'afterbegin', '<div id="nlRefresh"><svg version="1.1" id="reload-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 342.5 342.5" style="enable-background:new 0 0 342.5 342.5;" xml:space="preserve"><path d="M254.37,22.255c-1.161-0.642-2.53-0.795-3.803-0.428c-1.274,0.367-2.35,1.226-2.992,2.387l-21.758,39.391'
            + 'c-1.335,2.417-0.458,5.459,1.96,6.794C264.616,90.748,287.5,129.495,287.5,171.52c0,63.649-51.782,115.431-115.431,115.431'
            + 'S56.638,235.169,56.638,171.52c0-23.888,7.557-47.427,21.382-66.897l34.478,34.478c1.338,1.337,3.315,1.806,5.109,1.21'
            + 'c1.795-0.596,3.101-2.152,3.374-4.024L139.963,6.271c0.228-1.563-0.295-3.141-1.412-4.258c-1.117-1.117-2.7-1.639-4.258-1.412'
            + 'L4.278,19.584c-1.872,0.273-3.428,1.579-4.023,3.374c-0.596,1.795-0.127,3.772,1.21,5.109l37.292,37.292'
            + 'C14.788,95.484,1.638,133,1.638,171.52c0,93.976,76.455,170.431,170.431,170.431c93.976,0,170.431-76.455,170.431-170.431'
            + 'C342.5,109.478,308.731,52.283,254.37,22.255z"/></svg></div>' );

        // this.nlElements.topbar = document.getElementById( 'nlTopbar' );
        this.nlElements.topbar = document.getElementsByClassName( 'material-background-nav-bar' )[0];
        // this.nlElements.topbarH = new Hammer( this.nlElements.topbar );
        this.nlElements.refEl = document.getElementById( 'nlRefresh' );
        this.nlElements.refIcon = document.getElementById( 'reload-icon' );
        this.nlElements.refIcon.style.transition = 'all ' + ( this.nlConfig.options.speed ) + 's ' + this.nlConfig.options.animation;
        // set initial values
        this.nlConfig.syncTrue = false;
        this.nlConfig.scroll.top = 0;
        this.nlConfig.center = ( this.nlConfig.deviceW / 2 ) - ( this.nlElements.refEl.offsetWidth / 2 );
        // move the element on pan]
        window.ionic.onGesture( 'pan', ( ev ) => this.move( ev ), this.nlElements.topbar );

        // register touch end event
        this.touchEnd( document.body );
    }

    public move( ev ) {
        this.nlConfig.center = ( this.nlConfig.deviceW / 2 ) - ( this.nlElements.refEl.offsetWidth / 2 );
        if ( !this.nlConfig.syncing ) {
            // if ( this.nlConfig.scroll.top < 1 ){
            this.nlElements.refEl.style.transition = 'none';
            let end = Math.floor( this.nlConfig.deviceH / 2 );
            let perc = ( ( 100 / this.nlConfig.deviceH ) * ev.center.y );

            if ( ev.center.y < end ) {
                this.nlConfig.syncTrue = false;
                let y = ( perc / 2 ) * ( end / 100 );
                let opacity = ( perc * 2 ) * ( 0.5 / 100 );
                let rotate = 0.36 * ( end / 100 * ( ev.center.y ) );
                this.nlElements.refIcon.style.transition = 'none';
                this.nlElements.refIcon.style.fill = this.nlConfig.options.refresh.defaultColor;
                this.nlHelpers.translate( this.nlElements.refIcon, '', '', '', '', '', '', '', '', '', opacity );
                this.nlHelpers.translate( this.nlElements.refEl, this.nlConfig.center, '', y, '', rotate );
            } else {
                this.nlElements.refIcon.style.transition = 'fill ' + this.nlConfig.options.speed * 4 + 's ' + this.nlConfig.options.animation;
                this.nlConfig.syncTrue = true;
                // let perc = ( end / 100 * ( ev.center.y - end ) );
                let percY = ( ( 100 / this.nlConfig.deviceH ) * ev.center.y );
                let percFull = ( ( 100 / ( this.nlConfig.deviceH / 2 ) ) * ( ev.center.y - end ) );
                let y = percY / 2 * ( end / 100 );
                y = y - ( ( y / 100 ) * percFull ) / 3.5;
                let rotate = 0.36 * ( end / 100 * ( ev.center.y ) );
                this.nlElements.refIcon.style.fill = this.nlConfig.options.refresh.activeColor;
                this.nlHelpers.translate( this.nlElements.refIcon, '', '', '', '', '', '', '', '', '', '1' );
                this.nlHelpers.translate( this.nlElements.refEl, this.nlConfig.center, '', y, '', rotate );
            }
            // }
        }
    }

    public touchEnd( element ) {

        let onEnd = function ( e, touch ) {
            let end = Math.floor( this.nlConfig.deviceH / 2 );
            let touchobj = touch ? e.changedTouches[ 0 ] : e;
            // wait for move event to end (0.1s)
            // then call callback function
            setTimeout( function () {
                this.nlElements.refEl.style.transition = 'all ' + ( this.nlConfig.options.speed / 2 ) + 's ' + this.nlConfig.options.animation;
                if ( touchobj.clientY > end && this.nlConfig.syncTrue && !this.nlConfig.syncing ) {
                    this.nlConfig.syncTrue = false;
                    this.nlConfig.syncing = true;
                    this.nlConfig.this.ended = false;
                    this.callback();
                    let step = 0;
                    let rotateStep = 0;
                    let rotate = 0.36 * ( end / 100 * ( touchobj.clientY - end ) ) + 360;
                    this.nlConfig.this.minY = this.nlConfig.options.content.topBarHeight + this.nlConfig.options.content.topBarHeight / 3;

                    this.nlHelpers.translate( this.nlElements.refEl, this.nlConfig.center, '', this.nlConfig.this.minY, '', rotate, '' );

                    setTimeout( function () {
                        this.nlElements.refEl.style.transition = 'all ' + ( this.nlConfig.options.speed / 2 ) + 's linear';
                        let waiter = setInterval( function () {
                            if ( this.nlConfig.this.ended ) {
                                clearInterval( waiter );
                            } else {
                                let rotation = rotate + rotateStep;
                                this.nlHelpers.translate( this.nlElements.refEl, this.nlConfig.center, '', this.nlConfig.this.minY, '', rotation, '' );
                                step += 0.1;
                                rotateStep += 6 + step;
                            }
                        }, 25 );
                    }, ( this.nlConfig.options.speed * 1000 ) );
                } else {
                    this.nlElements.refEl.style.transition = 'all ' + ( this.nlConfig.options.speed ) + 's ' + this.nlConfig.options.animation;
                    this.nlHelpers.translate( this.nlElements.refEl, this.nlConfig.center, '', 0, '', 0, '' );
                    this.nlConfig.syncTrue = false;
                    this.nlConfig.syncing = false;
                }
            }, 50 );
        };

        // listen for touch end event on touch devices
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

    public callback() {
        setTimeout( function () {
            this.nlConfig.syncEndTrue();
        }, 2500 );
    }

    public syncEnd() {
        this.nlConfig.nlRefresh.ended = true;
        setTimeout( function () {
            this.nlElements.refEl.style.transition = 'all ' + ( this.nlConfig.options.speed / 2 ) + 's ' + this.nlConfig.options.animation;
            this.nlHelpers.translate( this.nlElements.refEl, this.nlConfig.center, '', this.nlConfig.this.minY, '', 0, '', '', '1.2' );
        }, 100 );
        setTimeout( function () {
            this.nlHelpers.translate( this.nlElements.refEl, this.nlConfig.center, '', this.nlConfig.this.minY, '', 0, '', '', '0' );
        }, 200 );
        setTimeout( function () {
            this.nlHelpers.translate( this.nlElements.refEl, this.nlConfig.center, '', 0, '', 0, '', '', '0' );
        }, 300 );
        this.nlConfig.syncTrue = false;
        this.nlConfig.syncing = false;
    }
}