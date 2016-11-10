import 'angular-ui-router';

import SecureWarningController from './secure-warning.component';

const dependencies = [
    'ui.router'
];

export default angular.module( 'secure-warning.component', dependencies )
    .directive( 'secureWarning', SecureWarningController )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.secureWarning', {
                    url: 'secureWarning',
                    views: {
                        content: {
                            template: '<secure-warning></secure-warning>'
                        }
                    }
                });
        }
    ] );
