import 'angular-ui-router';
import component from './expense-detail.component';

const dependencies = [
    'ui.router'
];

export default angular.module( 'expense-detail.component', dependencies )
    .directive( 'expenseDetail', component )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.transparency.expenseDetail', {
                    url: 'expense/:id/:label/:from/:to',
                    views: {
                        transparencyContent: {
                            template: '<expense-detail></expense-detail>'
                        }
                    }
                });
        }
    ] );




