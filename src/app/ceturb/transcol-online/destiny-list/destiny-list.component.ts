import './destiny-list.component.scss';
import template = require( './destiny-list.component.html' );
// tslint:disable
export const DestinyListComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        markers: '<'
    }
};
