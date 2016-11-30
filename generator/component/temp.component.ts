import './<%= fileName %>.component.scss';
import template = require( './<%= fileName %>.component.html' );
import { <%= className %>Controller } from './<%= fileName %>.component.controller';

// tslint:disable-next-line
export const <%= className %>Component = {
    template: template,
    controller: <%= className %>Controller
};