import { <%= upCaseName %>Component } from './<%= name %>.component';

export default angular.module( '<%= name %>.module', [] )

    // components
    .directive( '<%= name %>', <%= upCaseName %>Component )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.<%= name %>', {
                    url: '<%= name %>',
                    views: {
                        content: {
                            template: '<<%= name %>></<%= name %>>'
                        }
                    }
                });
        }
    ] ).name;