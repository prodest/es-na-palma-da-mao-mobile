
import 'angular-ui-router';

import SearchComponent from './search.component';
import dioShared from '../shared/index';

const dependencies = [
    'ui.router', dioShared.name
];

export default angular.module( 'dio-search.component', dependencies )
    .directive( 'dioSearch', SearchComponent )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.dioSearch', {
                    url: 'dio/search',
                    data: { title: 'DIO' },
                    views: {
                        content: {
                            template: '<dio-search></dio-search>'
                        }
                    }
                });
        }
    ] );
