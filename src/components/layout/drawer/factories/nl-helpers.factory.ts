
export class NlHelpers {

    public translate( myElement, x, pmX, y, pmY, deg, pmDeg, width, scale, mozieo, opacity ) {
        let el = myElement;

        x = x || 0;
        y = y || 0;
        pmX = pmX || '';
        pmY = pmY || '';
        pmDeg = pmDeg || '';
        width = width || false;

        //
        if ( el.id === 'nlRefresh' ) {
            if ( scale ) {
                scale = 'scale3d(' + scale + ',' + scale + ',1)';
            } else {
                scale = 'scale3d(1,1,1)';
            }
        } else {
            //
            scale = scale ? 'scale3d(' + scale + ',1,1)' : '';
        }
        //
        if ( el.id === 'burger-top' ) {
            //
            el.style.transformOrigin = '100% 100%';
        } else if ( el.id === 'burger-bottom' ) {
            //
            el.style.transformOrigin = '100% 0%';
        }
        //
        el.style.transform = 'translate3d(' + pmX + x + 'px, ' + pmY + y + 'px, 0) rotate3d( 0, 0, 1, ' + pmDeg + deg + 'deg ) ' + scale;
        el.style.webkitTransform = 'translate(' + pmX + x + 'px, ' + pmY + y + 'px) translateZ(0) rotate(' + pmDeg + deg + 'deg) ' + scale;
        if ( width ) { el.style.width = width + 'px'; };
        if ( opacity ) { el.style.opacity = opacity; };
        if ( width ) { el.style[ 'max-width' ] = width + 'px'; };
        // only for mozzila, opera and IE
        if ( mozieo ) { el.style.msTransform = el.style.MozTransform = el.style.OTransform = 'translateX(' + pmX + x + 'px) translateY(' + pmY + y + 'px) rotate(' + pmDeg + deg + 'deg)'; }
    }

    public merge( obj1, obj2 ) {
        let obj3 = {};
        for ( let attrname in obj1 ) {
            if ( obj3.hasOwnProperty( attrname ) ) {
                obj3[ attrname ] = obj1[ attrname ];
            }
        }
        for ( let attrname in obj2 ) {
            if ( typeof obj1[ attrname ] === 'object' ) {
                obj3[ attrname ] = this.merge( obj1[ attrname ], obj2[ attrname ] );
            } else {
                obj3[ attrname ] = obj2[ attrname ];
            }
        }
        return obj3;
    }
}