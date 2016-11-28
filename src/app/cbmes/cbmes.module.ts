import { WarningListComponent } from './warning-list/warning-list.component';
import { CbmesApiService, WarningLevelService } from './shared/index';

export default angular.module( 'cbmes.module', [] )

    // services
    .service( 'cbmesApiService', CbmesApiService )
    .service( 'warningLevelService', WarningLevelService )

    // components
    .directive( 'warningList', WarningListComponent )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.warningList', {
                    url: 'warningList',
                    views: {
                        content: {
                            template: '<warning-list></warning-list>'
                        }
                    }
                });
        }
    ] ).name;
