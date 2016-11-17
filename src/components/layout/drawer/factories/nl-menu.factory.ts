import { NlElements } from './nl-elements.factory';
import { NlHelpers } from './nl-helpers.factory';

export class NlMenu {

    public static $inject: string[] = [ '$nlElements', '$nlHelpers' ];

    constructor( private nlElements: NlElements, private nlHelpers: NlHelpers ) {
        // this.init();
    }


    public openned: boolean = false;

    public init() {
        this.nlElements.menu = document.getElementById( 'nlMenu' );
        // this.nlElements.menu.insertAdjacentHTML( 'afterbegin', '<div id="nlIcon"><div id="dot-top"></div><div id="dot-center"></div><div id="dot-bottom"></div></div>' );
        this.nlElements.menuContent = document.getElementById( 'nlMenuContent' );
        // this.nlElements.menuContentH = new Hammer( this.nlElements.menuContent );
        this.nlElements.menuIcon = document.getElementById( 'nlIcon' );
        // this.nlElements.menuIconH = new Hammer( this.nlElements.menuIcon );
        this.nlElements.bodyH.on( 'tap', function ( ev ) {
            if ( this.openned ) {
                this.hide();
            }
        });
        this.nlElements.menuIconH.on( 'tap', function ( ev ) {
            this.show();
        });
    }
    
    public show() {
        this.nlElements.menuContent.style.visibility = 'visible';
        this.nlElements.menuContent.style.opacity = '1';
        this.nlHelpers.translate( this.nlElements.menuContent, 0, '', 0, '', 0 );
        setTimeout( function () {
            this.openned = true;
        }, 50 );
    }

    public hide() {
        this.nlElements.menuContent.style.visibility = 'hidden';
        this.nlElements.menuContent.style.opacity = '0';
        this.nlHelpers.translate( this.nlElements.menuContent, 0, '', 0, '', 0 );
        this.openned = false;
    }
}