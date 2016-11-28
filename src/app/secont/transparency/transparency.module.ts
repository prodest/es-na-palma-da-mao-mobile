// money flow
import { ExpensesByAreaComponent } from './expenses-by-area/expenses-by-area.component';
import { ExpensesByOriginComponent } from './expenses-by-origin/expenses-by-origin.component';
import { RevenuesComponent } from './revenues/revenues.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { RevenueDetailComponent } from './revenue-detail/revenue-detail.component';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';

// main
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import {
    ReportTitleComponent,
    PieChartComponent,
    HorizontalBarChartComponent,
    LastUpdateComponent,
    ReportListSummaryComponent,
    ReportListComponent,
    ReportListItemComponent,
    MoneyFlowReportComponent,
    TransparencyApiService
} from './shared/index';

export default angular.module( 'secont.transparency.module', [] )

    // services
    .service( 'transparencyApiService', TransparencyApiService )

    // widgets
    .component( 'reportTitle', ReportTitleComponent )
    .component( 'pieChart', PieChartComponent )
    .component( 'horizontalBarChart', HorizontalBarChartComponent )
    .component( 'lastUpdate', LastUpdateComponent )
    .component( 'reportListSummary', ReportListSummaryComponent )
    .component( 'reportList', ReportListComponent )
    .component( 'reportListItem', ReportListItemComponent )
    .component( 'moneyFlowReport', MoneyFlowReportComponent )

    // routed components
    .directive( 'transparencyDashboard', DashboardComponent )
    .directive( 'transparencyAbout', AboutComponent )
    .directive( 'revenues', RevenuesComponent )
    .directive( 'revenueDetail', RevenueDetailComponent )
    .directive( 'expensesByOrigin', ExpensesByOriginComponent )
    .directive( 'expensesByArea', ExpensesByAreaComponent )
    .directive( 'expenseDetail', ExpenseDetailComponent )
    .directive( 'budgets', BudgetsComponent )

    // routes 
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.secontTransparencyDashboard', {
                    url: '/secont/transparency/dashboard', views: {
                        content: {
                            template: '<transparency-dashboard></transparency-dashboard>'
                        }
                    }
                })
                .state( 'app.secontTransparencyAbout', {
                    url: '/secont/transparency/about',
                    nativeTransitions: {
                        type: 'slide',
                        direction: 'up'
                    },
                    views: {
                        content: {
                            template: '<transparency-about></transparency-about>'
                        }
                    }
                })

                // money flow
                .state( 'app.secontTransparencyRevenues', {
                    url: 'secont/transparency/revenues',
                    views: {
                        content: {
                            template: '<revenues></revenues>'
                        }
                    }
                })
                .state( 'app.secontTransparencyRevenueDetail', {
                    url: 'secont/transparency/revenue/:id/:label/:from/:to',
                    views: {
                        content: {
                            template: '<revenue-detail></revenue-detail>'
                        }
                    }
                })
                .state( 'app.secontTransparencyExpensesByOrigin', {
                    url: 'secont/transparency/expenses-by-origin', views: {
                        content: {
                            template: '<expenses-by-origin></expenses-by-origin>'
                        }
                    }
                })
                .state( 'app.secontTransparencyExpensesByArea', {
                    url: 'secont/transparency/expenses-by-area', views: {
                        content: {
                            template: '<expenses-by-area></expenses-by-area>'
                        }
                    }
                })
                .state( 'app.secontTransparencyExpenseDetail', {
                    url: 'secont/transparency/expense/:id/:label/:from/:to', views: {
                        content: {
                            template: '<expense-detail></expense-detail>'
                        }
                    }
                })
                .state( 'app.secontTransparencyBudgets', {
                    url: 'secont/transparency/budgets', views: {
                        content: {
                            template: '<budgets></budgets>'
                        }
                    }
                });
        }
    ] )
    .name;

export * from './shared/index';
