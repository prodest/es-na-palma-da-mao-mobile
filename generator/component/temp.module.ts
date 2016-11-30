import { <%= className %>Component } from './<%= fileName %>.component';

export default angular.module( '<%= fileName %>.module', [] )

    // components
    .component( '<%= fileName %>', <%= className %>Component ).name;