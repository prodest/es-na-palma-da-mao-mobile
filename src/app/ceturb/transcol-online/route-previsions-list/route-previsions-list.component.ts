import './route-previsions-list.component.scss';
import template = require( './route-previsions-list.component.html' );
// tslint:disable
export const RoutePrevisionsListComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        previsions: '<',
        onPrevisionClick: '&',
        onRefreshClick: '&'
    }
};
