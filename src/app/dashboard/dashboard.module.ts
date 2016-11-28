import { DashBoardComponent } from './dashboard.component';

export default angular.module( 'dashboard.module', [] )

    // component
    .directive( 'dashboard', DashBoardComponent )

    // route
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.dashboard', {
                    url: 'dashboard/',
                    abstract: true,
                    views: {
                        content: {
                            template: '<dashboard></dashboard>'
                        }
                    }
                });
        }
    ] ).name;





