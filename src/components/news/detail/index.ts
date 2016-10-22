
import 'angular-ui-router';

import newsDetailComponent from './news-detail.component';
import newsShared from '../shared/index';

const dependencies = [
    'ui.router', newsShared.name
];

export default angular.module( 'news-detail.component', dependencies )
                      .directive( 'newsDetail', newsDetailComponent )
                      .config( [
                          '$stateProvider', ( $stateProvider ) => {
                              $stateProvider
                                  .state( 'app.news/:id', {
                                      url: '/news/:id',
                                      data: {title: 'Notícia'},
                                      views: {
                                          content: {
                                              template: '<news-detail></news-detail>'
                                          }
                                      }
                                  } );
                          }
                      ] );
