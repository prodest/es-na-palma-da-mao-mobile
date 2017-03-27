import { BusLinesComponent } from './bus-lines/bus-lines.component';
import { BusInfoComponent } from './bus-info/bus-info.component';
import { TranscolOnlineComponent } from './transcol-online/transcol-online.component';
import { CeturbStorage, CeturbApiService } from './shared/index';

export default angular.module( 'ceturb.module', [] )

    // services
    .service( 'ceturbStorage', CeturbStorage )
    .service( 'ceturbApiService', CeturbApiService )

    // components
    .directive( 'busLines', BusLinesComponent )
    .directive( 'busInfo', BusInfoComponent )
    .directive( 'transcolOnline', TranscolOnlineComponent )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.busLines', {
                    url: 'busLines',
                    views: {
                        content: {
                            template: '<bus-lines></bus-lines>'
                        }
                    }
                })
                .state( 'app.busInfo/:id', {
                    url: 'busInfo/:id',
                    views: {
                        content: {
                            template: '<bus-info></bus-info>'
                        }
                    }
                })
                .state( 'app.transcolOnline', {
                    url: 'transcolOnline',
                    views: {
                        content: {
                            template: '<transcol-online></transcol-online>'
                        }
                    }
                });
        }
    ] )
    .name;