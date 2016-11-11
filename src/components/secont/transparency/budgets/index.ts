import 'angular-ui-router';
import component from './budgets.component';

const dependencies = [
    'ui.router'
];

export default angular.module( 'budgets.component', dependencies )
    .directive( 'budgets', component )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.transparency.budgets', {
                    url: 'budgets',
                    views: {
                        transparencyContent: {
                            template: '<budgets></budgets>'
                        }
                    }
                });
        }
    ] );




