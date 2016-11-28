/**
 * Configura aspectos da app como: temas, etc
 *
 * @param {Object} $mdThemingProvider - service.
 * @param {Object} $mdIconProvider - service.
 * @param {Object} $mdColorPalette - service.
 *
 * @returns {void}
 */
function themeConfig( $mdThemingProvider, $mdAriaProvider ) {

    $mdAriaProvider.disableWarnings();

    const customPrimary = {
        '50': '#67c7e2',
        '100': '#52bfde',
        '200': '#3cb7da',
        '300': '#549db2', // #549db2
        '400': '#249dbf',
        '500': '#208BAA',
        '600': '#1c7994',
        '700': '#18687f',
        '800': '#14566a',
        '900': '#104554',
        'A100': '#7dcfe6',
        'A200': '#92d7ea',
        'A400': '#a7dfef',
        'A700': '#0c333f',
        'contrastDefaultColor': 'light'
    };
    const customAccent = {
        '50': '#6e2731',
        '100': '#802e39',
        '200': '#933541',
        '300': '#a63c4a',
        '400': '#b94252',
        '500': '#c15362',
        '600': '#cf7984',
        '700': '#d58b95',
        '800': '#dc9ea6',
        '900': '#e3b1b8',
        'A100': '#cf7984',
        'A200': '#C86673',
        'A400': '#c15362',
        'A700': '#eac4c9',
        'contrastDefaultColor': 'light'
    };

    const customWarn = {
        '50': '#ffb280',
        '100': '#ffa266',
        '200': '#ff934d',
        '300': '#ff8333',
        '400': '#ff741a',
        '500': '#ff6400',
        '600': '#e65a00',
        '700': '#cc5000',
        '800': '#b34600',
        '900': '#993c00',
        'A100': '#ffc199',
        'A200': '#ffd1b3',
        'A400': '#ffe0cc',
        'A700': '#803200'
    };

    const customBackground = {
        '50': '#737373',
        '100': '#666666',
        '200': '#595959',
        '300': '#4d4d4d',
        '400': '#404040',
        '500': '#333',
        '600': '#262626',
        '700': '#1a1a1a',
        '800': '#0d0d0d',
        '900': '#000000',
        'A100': '#808080',
        'A200': '#8c8c8c',
        'A400': '#999999',
        'A700': '#000000'
    };

    $mdThemingProvider
        .definePalette( 'customAccent', customAccent );
    $mdThemingProvider
        .definePalette( 'customPrimary', customPrimary );
    $mdThemingProvider
        .definePalette( 'customWarn', customWarn );
    $mdThemingProvider
        .definePalette( 'customBackground', customBackground );

    /*
     Primary and warn palettes

     md-primary': '500';
     md-hue-1': '300';
     md-hue-2': '800';
     md-hue-3': 'A100';
     */

    /*
     Accent palette

     md-primary': 'A200';
     md-hue-1': 'A100';
     md-hue-2': 'A400';
     md-hue-3': 'A700';
     */

    $mdThemingProvider
        .theme( 'espm' )
        .primaryPalette( 'customPrimary' )
        .accentPalette( 'customAccent' )
        .warnPalette( 'customWarn' );

    $mdThemingProvider.setDefaultTheme( 'espm' );
}

export default [
    '$mdThemingProvider',
    '$mdAriaProvider',
    themeConfig
];
