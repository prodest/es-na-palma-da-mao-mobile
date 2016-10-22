
import 'angular-ui-router';

import newsListComponent from './news-list.component';
import newsShared from '../shared/index';

const dependencies = [
    'ui.router', newsShared.name
];

export default angular.module( 'news-list.component', dependencies )
                      .directive( 'newsList', newsListComponent )
                      .config( [
                          '$stateProvider', ( $stateProvider ) => {
                              $stateProvider
                                  .state( 'app.news', {
                                      url: 'news',
                                      data: {title: 'Notícias'},
                                      views: {
                                          content: {
                                              template: '<news-list></news-list>'
                                          }
                                      }
                                  } );
                          }
                      ] );
