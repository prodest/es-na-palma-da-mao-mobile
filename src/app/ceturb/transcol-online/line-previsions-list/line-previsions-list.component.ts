import './line-previsions-list.component.scss';
import template = require( './line-previsions-list.component.html' );
// tslint:disable
export const LinePrevisionsListComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        line: '<',
        previsions: '<',
        onPrevisionClick: '&',
        onRefreshClick: '&'
    }
};
