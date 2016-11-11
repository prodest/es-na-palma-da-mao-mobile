import 'angular-ui-router';
import component from './about.component';

const dependencies = [
    'ui.router'
];

export default angular.module( 'transparency-about.component', dependencies )
    .directive( 'transparencyAbout', component )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.transparency.about', {
                    url: 'about',
                    nativeTransitions: {
                        type: 'slide',
                        direction: 'up'
                    },
                    views: {
                        transparencyContent: {
                            template: '<transparency-about></transparency-about>'
                        }
                    }
                });
        }
    ] );
