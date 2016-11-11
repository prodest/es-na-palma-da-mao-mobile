import { NlRefresh } from './nl-refresh.factory';

export class NlConfig {

    constructor( nlRefresh: NlRefresh ){
    }

    public openned = false;
    public plusActive = false;
    public holdPos = undefined;
    public reverse = false;
    public scroll = {};
    public nlRefresh = {};
    public options = {
        // global settings
        speed: 0.2,
        animation: 'ease',
        // use action button
        actionButton: false,
        // use toast messages
        toast: false,
        // use three dot menu
        secMenu: false,
        // burger specific
        burger: {
            show: false,
            endY: 6,
            startScale: 1, // X scale of bottom and top line of burger menu at starting point (OFF state)
            endScale: 0.7 // X scale of bottom and top line of burger menu at end point (ON state)
        },
        // content specific
        content: {
            topBarHeight: 0,
            modify: false
        },
        // drawer specific
        drawer: {
            maxWidth: 300,
            openCb: function () {
                console.info( '%c[≡]%c $nlDrawer: opened', 'color: #333;', 'color: #558844;' );
            },
            closeCb: function () {
                console.info( '%c[≡]%c $nlDrawer: closed', 'color: #333;', 'color: #558844;' );
            }
        },
        // refresh specific
        refresh: {
            defaultColor: '#aa3344', // default(inactive) color
            activeColor: '#558844', // active color
            callback: function () {
                // after doing some stuff end syncing animation
                console.info( '%c[≡]%c $nlRefresh: callback', 'color: #333;', 'color: #558844;' );
                this.nlRefresh.syncEnd();
            }
        }
    }
}