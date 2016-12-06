import { <%= className %>Component } from './<%= fileName %>.component';

export default angular.module( '<%= fileName %>.module', [] )

    // components
    .component( '<%= className %>', <%= className %>Component ).name;