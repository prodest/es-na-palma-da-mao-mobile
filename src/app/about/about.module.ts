
import { AboutComponent } from './about.component';
import { TeamsApiService } from './shared/index';

export default angular.module( 'about.module', [] )

    // services
    .service( 'teamsApiService', TeamsApiService )

    // components
    .directive( 'about', AboutComponent )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.about', {
                    url: 'about',
                    views: {
                        content: {
                            template: '<about></about>'
                        }
                    }
                });
        }
    ] ).name;