import './public-works-status.component.scss';
import template = require( './public-works-status.component.html' );

// tslint:disable-next-line
export const PublicWorksStatusComponent = {
    template: template,
    bindings: {
        status: '<'
    }
};