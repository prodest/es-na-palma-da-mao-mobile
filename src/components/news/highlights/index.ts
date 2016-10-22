
import 'angular-ui-router';

import newsHighlightsComponent from './news-highlights.component';
import newsShared from '../shared/index';

const dependencies = [
    'ui.router', newsShared.name
];

export default angular.module( 'news-highlights.component', dependencies )
                      .directive( 'newsHighlights', newsHighlightsComponent )
                      .config( [
                          '$stateProvider', ( $stateProvider ) => $stateProvider
                              .state( 'app.dashboard.newsHighlights', {
                                  url: 'news/highlights',
                                  data: {title: 'DESTAQUES'},
                                  views: {
                                      'tab-news': {
                                          template: '<news-highlights></news-highlights>'
                                      }
                                  }
                              } )
                      ] );



