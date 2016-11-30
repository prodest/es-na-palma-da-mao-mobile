import './<%= name %>.component.scss';
import template = require( './<%= name %>.component.html' );
import { <%= upCaseName %>Controller } from './<%= name %>.component.controller';

// tslint:disable-next-line
export const <%= upCaseName %>Component = () => {
    return {
        template: template,
        controller: <%= upCaseName %>Controller,
        restrict: 'E',
        controllerAs: 'vm',
        replace: true,
        bindToController: true
    };
};