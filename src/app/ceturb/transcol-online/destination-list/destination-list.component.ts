import './destination-list.component.scss';
import template = require( './destination-list.component.html' );
// tslint:disable
export const DestinationListComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        destinations: '<',
        onDestinationClick: '&'
    }
};
