import './route-prevision-list.component.scss';
import template = require( './route-prevision-list.component.html' );
// tslint:disable
export const RoutePrevisionListComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        previsions: '<',
        loading: '<',
        title: '@',
        onPrevisionClick: '&',
        onRefreshClick: '&'
    }
};
