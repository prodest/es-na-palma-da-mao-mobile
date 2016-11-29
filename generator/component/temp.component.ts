import './<%= name %>.component.css';
import template = require( './<%= name %>.component.html' );
import { <%= upCaseName %>Controller } from './<%= name %>.component.controller';

// tslint:disable-next-line
export const <%= upCaseName %>Component = {
    template: template,
    controller: <%= upCaseName %>Controller
};