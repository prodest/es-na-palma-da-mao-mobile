import { HomeComponent } from './home.component';

export default angular.module( 'home.module', [] )

    // components
    .directive( 'home', HomeComponent )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'home', {
                    url: 'home',
                    nativeTransitions: {
                        'type': 'fade'
                    },
                    template: '<home></home>'
                });
        }
    ] ).name;

