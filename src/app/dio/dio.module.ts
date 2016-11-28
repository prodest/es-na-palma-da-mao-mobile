import { DioApiService } from './shared/index';
import { LatestEditionsComponent } from './latest-editions/latest-editions.component';
import { SearchComponent } from './search/search.component';

export default angular.module( 'dio.module', [] )

    // services
    .service( 'dioApiService', DioApiService )

    // components
    .directive( 'latestEditions', LatestEditionsComponent )
    .directive( 'search', SearchComponent )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider.state( 'app.dioLatest', {
                url: 'dio/latest',
                views: {
                    content: {
                        template: '<latest-editions></latest-editions>'
                    }
                }
            })
                .state( 'app.dioSearch', {
                    url: 'dio/search',
                    views: {
                        content: {
                            template: '<search></search>'
                        }
                    }
                });
        }
    ] )
    .name;

