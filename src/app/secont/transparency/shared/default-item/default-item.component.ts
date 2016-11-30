import './default-item.component.scss';
import template = require( './default-item.component.html' );

// tslint:disable-next-line
export const DefaultItemComponent = {
    template: template,
    bindings: {
        item: '<',
        showLegend: '<'
    }
};