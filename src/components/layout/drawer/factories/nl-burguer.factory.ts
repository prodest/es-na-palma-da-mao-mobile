import Hammer from 'hammerjs';
import { NlElements } from './nl-elements.factory';
import { NlConfig } from './nl-config.factory';
import { NlHelpers } from './nl-helpers.factory';

export class NlBurger {

    constructor( private nlConfig: NlConfig, private nlHelpers: NlHelpers, private nlElements: NlElements ) {
        this.init();
    }

    private isOn = false;

    public animate( pos ) {
        let total = this.nlConfig.maxWidth;
        let current = total - Math.abs( pos );
        let currentPerc = Math.floor(( 100 / total ) * current );
        if ( currentPerc > 0 ) {
            //
            // var currentWidth = this.nlConfig.options.burger.startWidth - Math.floor(((6/100)*currentPerc));
            let scale = this.nlConfig.options.burger.startScale - Math.abs(( ( ( 1 - this.nlConfig.options.burger.endScale ) / 100 ) * currentPerc ) ).toFixed( 2 );
            // for both lines
            let rotate = Math.floor(( ( 45 / 100 ) * currentPerc ) );
            // console.log( this.nlConfig.options.burger.endY );
            let ypos = Math.floor(( ( this.nlConfig.options.burger.endY / 100 ) * currentPerc ) );
            ypos = ypos < this.nlConfig.options.burger.endY ? ypos : this.nlConfig.options.burger.endY;
            // Complete burger rotation
            let rotateComplete = Math.floor(( ( 180 / 100 ) * currentPerc ) );
            //
            if ( this.nlConfig.options.reverse ) {
                rotateComplete = 180 + ( 180 - rotateComplete );
            }
            //
            this.nlElements.burger.style.transition = 'none';
            this.nlElements.burgerTop.style.transition = 'none';
            this.nlElements.burgerBottom.style.transition = 'none';
            //
            this.nlHelpers.translate( this.nlElements.burger, 0, '', 0, '', rotateComplete, '', '' );
            this.nlHelpers.translate( this.nlElements.burgerTop, 0, '', ypos, '', rotate, '', '', scale );
            this.nlHelpers.translate( this.nlElements.burgerBottom, 0, '', ypos, '-', rotate, '-', '', scale );
        }
    }

    public toggle( toggle ) {
        // set transitions length for animation
        this.nlElements.burger.style.transition = 'all ' + this.nlConfig.options.speed + 's ' + this.nlConfig.options.animation;
        this.nlElements.burgerTop.style.transition = 'all ' + this.nlConfig.options.speed + 's ' + this.nlConfig.options.animation;
        this.nlElements.burgerBottom.style.transition = 'all ' + this.nlConfig.options.speed + 's ' + this.nlConfig.options.animation;
        //
        if ( toggle || ( toggle && !this.isOn ) ) {
            // ON
            this.setOn();
        } else {
            // OFF
            this.setOff();
        }
    }
    
    public toggleEnd() {
        setTimeout( function () {
            this.nlElements.burger.style.transition = 'none';
            this.nlElements.burgerTop.style.transition = 'none';
            this.nlElements.burgerBottom.style.transition = 'none';
            if ( !this.isOn ) {
                this.nlHelpers.translate( this.nlElements.burger, 0, '', 0, '-', 0, '' );
                this.nlConfig.options.reverse = false;
            } else {
                this.nlConfig.options.reverse = true;
            }
        }, this.nlConfig.options.speed * 1000 );
    }
    
    public setOn() {
        this.nlHelpers.translate( this.nlElements.burgerTop, 0, '', this.nlConfig.options.burger.endY, '', 45, '', '', this.nlConfig.options.burger.endScale );
        this.nlHelpers.translate( this.nlElements.burgerBottom, 0, '', this.nlConfig.options.burger.endY, '-', 45, '-', '', this.nlConfig.options.burger.endScale );
        this.nlHelpers.translate( this.nlElements.burger, 0, '', 0, '-', 180, '' );
        this.isOn = true;
        // reset burger state after the animation is done
        this.toggleEnd();
    }

    public setOff() {
        this.nlHelpers.translate( this.nlElements.burgerTop, 0, '', 0, '', 0, '', '', this.nlConfig.options.burger.startScale );
        this.nlHelpers.translate( this.nlElements.burgerBottom, 0, '', 0, '', 0, '', '', this.nlConfig.options.burger.startScale );
        if ( this.nlConfig.options.reverse ) {
            this.nlHelpers.translate( this.nlElements.burger, 0, '', 0, '-', 360, '' );
        } else {
            this.nlHelpers.translate( this.nlElements.burger, 0, '', 0, '-', 0, '' );
        }
        this.isOn = false;
        // reset burger state after the animation is done
        this.toggleEnd();
    }
    
    public init() {
        // burger elements
        let burger = '<div id="nlBurger"><div id="burger-top"></div><div id="burger-center"></div><div id="burger-bottom"></div></div>';
        if ( document.getElementById( 'nlBurger' ) === undefined ) { document.body.insertAdjacentHTML( 'beforeend', burger ); };
        //
        this.nlElements.burger = document.getElementById( 'nlBurger' );
        this.nlElements.burgerH = new Hammer( this.nlElements.burger );
        this.nlElements.burgerTop = document.getElementById( 'burger-top' );
        this.nlElements.burgerBottom = document.getElementById( 'burger-bottom' );
        if ( typeof this.nlConfig.options.drawer !== 'object' ) {
            this.nlElements.burgerH.on( 'tap', function ( ev ) {
                this.toggle();
            });
        }
    }
}