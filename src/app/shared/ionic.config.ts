/**
 * Configura aspectos da app como: temas, etc
 *
 * @param {Object} $ionicConfigProvider - service
 *
 * @returns {void}
 */
function ionicConfig( $ionicConfigProvider, $ionicNativeTransitionsProvider, $compileProvider ) {

    // Use for change ionic spinner to android pattern.
    $ionicConfigProvider.spinner.icon( 'android' );

    $ionicConfigProvider.views.swipeBackEnabled( false );

    // console.log( 'disable ionic transitions' );
    $ionicConfigProvider.views.transition( 'none' );

    $ionicConfigProvider.scrolling.jsScrolling( false );

    let nativeTransitionsOptions = {
        duration: 300, // in milliseconds (ms), default 400,
        // slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
        // iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default 60
        // androiddelay: -1, // same as above but for Android, default 70
        // winphonedelay: -1, // same as above but for Windows Phone, default 200,
        fixedPixelsTop: 44, // the number of pixels of your fixed header, default 0 (iOS and Android)
        // fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
        backInOppositeDirection: true // Takes over default back transition and state back transition to use the opposite direction transition to go back
    };

    if ( !ionic.Platform.isAndroid() ) {
        nativeTransitionsOptions.fixedPixelsTop = 63;
    }

    $compileProvider.debugInfoEnabled( false );

    $ionicNativeTransitionsProvider.setDefaultOptions( nativeTransitionsOptions );
}

ionicConfig.$inject = [ '$ionicConfigProvider', '$ionicNativeTransitionsProvider', '$compileProvider' ];

export default ionicConfig;
