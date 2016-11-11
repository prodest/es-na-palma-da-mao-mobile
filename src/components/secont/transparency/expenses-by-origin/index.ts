import 'angular-ui-router';
import component from './expenses-by-origin.component';

const dependencies = [
    'ui.router'
];

export default angular.module( 'expenses-by-origin.component', dependencies )
    .directive( 'expensesByOrigin', component )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.transparency.expensesByOrigin', {
                    url: 'expenses-by-origin',
                    views: {
                        transparencyContent: {
                            template: '<expenses-by-origin></expenses-by-origin>'
                        }
                    }
                });
        }
    ] );




