import { NewsApiService } from './shared/index';
import { NewsDetailComponent } from './detail/news-detail.component';
import { NewsHighlightsComponent } from './highlights/news-highlights.component';
import { NewsListComponent } from './list/news-list.component';

export default angular.module( 'news.module', [] )
    // services
    .service( 'newsApiService', NewsApiService )

    // components
    .directive( 'newsDetail', NewsDetailComponent )
    .directive( 'newsHighlights', NewsHighlightsComponent )
    .directive( 'newsList', NewsListComponent )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.news/:id', {
                    url: '/news/:id',
                    views: {
                        content: {
                            template: '<news-detail></news-detail>'
                        }
                    }
                })
                .state( 'app.dashboard.newsHighlights', {
                    url: 'news/highlights',
                    views: {
                        'tab-news': {
                            template: '<news-highlights></news-highlights>'
                        }
                    }
                })
                .state( 'app.news', {
                    url: 'news',
                    views: {
                        content: {
                            template: '<news-list></news-list>'
                        }
                    }
                });
        }
    ] )
    .name;
