import 'angular-ui-router';

import SignUpComponent from './signup.component';

const dependencies = [
    'ui.router'
];

export default angular.module( 'signup.component', dependencies )
    .directive( 'signup', SignUpComponent )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.signup', {
                    url: 'signup',
                    views: {
                        content: {
                            template: '<signup></signup>'
                        }
                    }
                });
        }
    ] );
