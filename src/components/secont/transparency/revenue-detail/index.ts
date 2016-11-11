import 'angular-ui-router';
import component from './revenue-detail.component';

const dependencies = [
    'ui.router'
];

export default angular.module( 'revenue-detail.component', dependencies )
    .directive( 'revenueDetail', component )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.transparency.revenueDetail', {
                    url: 'revenue/:id/:label/:from/:to',
                    views: {
                        transparencyContent: {
                            template: '<revenue-detail></revenue-detail>'
                        }
                    }
                });
        }
    ] );




