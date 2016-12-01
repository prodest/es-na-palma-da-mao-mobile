import './public-works-by-city-item.component.scss';
import template = require( './public-works-by-city-item.component.html' );

// tslint:disable-next-line
export const PublicWorksByCityItemComponent = {
    template: template,
    bindings: {
        item: '<',
        showLegend: '<'
    }
};