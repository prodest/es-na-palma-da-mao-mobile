
import 'angular-ui-router';

import aboutComponent from './about.component';
import aboutShared from './shared/index';

const dependencies = [
    'ui.router', aboutShared.name
];

export default angular.module( 'about.component', dependencies )
    .directive( 'about', aboutComponent )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.about', {
                    url: 'about',
                    data: { title: 'Sobre' },
                    views: {
                        content: {
                            template: '<about></about>'
                        }
                    }
                });
        }
    ] );