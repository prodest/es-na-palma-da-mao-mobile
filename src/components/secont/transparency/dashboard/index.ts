import 'angular-ui-router';
import component from './dashboard.component';

const dependencies = [
    'ui.router'
];

export default angular.module( 'transparency-dashboard.component', dependencies )
    .directive( 'transparencyDashboard', component )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.transparency.dashboard', {
                    url: 'dashboard',
                    views: {
                        transparencyContent: {
                            template: '<transparency-dashboard></transparency-dashboard>'
                        }
                    }
                });
        }
    ] );
