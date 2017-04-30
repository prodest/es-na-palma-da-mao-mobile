import './line-prevision-list.component.scss';
import template = require( './line-prevision-list.component.html' );
// tslint:disable
export const LinePrevisionListComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        line: '<',
        previsions: '<',
        onPrevisionClick: '&',
        onRefreshClick: '&'
    }
};
