import dashboard from './dashboard/index';
import expensesByArea from './expenses-by-area/index';
import expensesByOrigin from './expenses-by-origin/index';
import revenues from './revenues/index';
import budgets from './budgets/index';
import revenueDetail from './revenue-detail/index';
import expenseDetail from './expense-detail/index';
import about from './about/index';
import shared from './shared/index';

let dependencies = [
    expensesByArea.name,
    expensesByOrigin.name,
    expenseDetail.name,
    revenues.name,
    revenueDetail.name,
    dashboard.name,
    about.name,
    budgets.name,
    shared.name
];

export default angular.module( 'secont-transparency', dependencies )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.transparency', {
                    url: 'transparency/',
                    abstract: true,
                    views: {
                        content: {
                            template: '<ion-nav-view name="transparencyContent"></ion-nav-view>'
                        }
                    }
                });
        }
    ] );
