
import 'angular-ui-router';

import latestComponent from './latest.component';
import dioShared from '../shared/index';

const dependencies = [
    'ui.router', dioShared.name
];

export default angular.module( 'dio-latest.component', dependencies )
    .directive( 'dioLatest', latestComponent )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.dioLatest', {
                    url: 'dio/latest',
                    data: { title: 'DIO' },
                    views: {
                        content: {
                            template: '<dio-latest></dio-latest>'
                        }
                    }
                });
        }
    ] );
