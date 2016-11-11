import 'angular-ui-router';
import component from './expenses-by-area.component';

const dependencies = [
    'ui.router'
];

export default angular.module( 'expenses-by-area.component', dependencies )
    .directive( 'expensesByArea', component )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.transparency.expensesByArea', {
                    url: 'expenses-by-area',
                    views: {
                        transparencyContent: {
                            template: '<expenses-by-area></expenses-by-area>'
                        }
                    }
                });
        }
    ] );




