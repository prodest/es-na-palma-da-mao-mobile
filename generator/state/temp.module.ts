import { <%= className %>Component } from './<%= fileName %>.component';

export default angular.module( '<%= fileName %>.module', [] )

    // components
    .directive( '<%= className %>', <%= className %>Component )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.<%= fileName %>', {
                    url: '<%= fileName %>',
                    views: {
                        content: {
                            template: '<<%= fileName %>></<%= fileName %>>'
                        }
                    }
                });
        }
    ] ).name;