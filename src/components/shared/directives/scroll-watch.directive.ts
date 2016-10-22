/* tslint:disable: no-unused-variable */
/**
 * @return {undefined}
 */
export function scrollWach() {
    return {
        restrict: 'A',
        link: function linkFn( $scope, $elem, $attrs ) {
            let offset = $attrs.offset ? parseInt( $attrs.offset.replace( /px;?/, '' ), 10 ) : 0;
            let scrollClass = $attrs.scrollClass || '';
            let classTarget = $attrs.classTarget || '';

            $elem.bind( 'scroll', function ( e ) {
                if ( e.srcElement.scrollTop > offset ) {
                    if ( scrollClass ) {
                        if ( classTarget ) {
                            angular.element( document.querySelectorAll( classTarget ) ).addClass( scrollClass );
                        } else {
                            $elem.addClass( scrollClass );
                        }
                    }
                } else {
                    if ( scrollClass ) {
                        if ( classTarget ) {
                            angular.element( document.querySelectorAll( classTarget ) ).removeClass( scrollClass );
                        } else {
                            $elem.removeClass( scrollClass );
                        }
                    }
                }
            } );
        }
    };
}
