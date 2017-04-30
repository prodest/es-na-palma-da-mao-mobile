import './origin-previsions-list.component.scss';
import template = require( './origin-previsions-list.component.html' );
// tslint:disable
export const OriginPrevisionsListComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        previsions: '<',
        origin: '<',
        onPrevisionClick: '&',
        onRefreshClick: '&'
    }
};
