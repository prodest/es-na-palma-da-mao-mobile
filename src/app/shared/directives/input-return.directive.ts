import { Keyboard } from 'ionic-native';

export function inputReturnDirective() {
  const ENTER = 13;
  const TAB = 9;


  let onEnterPressed = ( $scope: any, value: string ) => {
    if ( $scope.vm.onEnterPressed ) {
      $scope.vm.onEnterPressed( value );
    }
    Keyboard.close();
  };

  return {
    restrict: 'A',
    link: function linkFn( $scope, $elem, $attrs ) {
      $elem.on( 'keyup', function ( event ) {
        if ( event.keyCode === ENTER ) {
          onEnterPressed( $scope, event.target.value );
        }
      });

      $elem.on( 'keydown', function ( event ) {
        if ( $scope.isAndroid && $attrs.type === 'number' && event.keyCode === TAB ) {
          onEnterPressed( $scope, event.target.value );
        }
      });
    }
  };
}
