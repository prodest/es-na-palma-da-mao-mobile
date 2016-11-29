import { <%= upCaseName %>Component } from './<%= name %>.component';

export default angular.module( '<%= name %>.module', [] )

    // components
    .component( '<%= name %>', <%= upCaseName %>Component ).name;