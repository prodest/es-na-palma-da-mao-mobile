import './destiny-list.component.scss';
import template = require( './destiny-list.component.html' );
// tslint:disable
export const DestinationListComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        destinations: '<',
        onDestinationClick: '&'
    }
};
