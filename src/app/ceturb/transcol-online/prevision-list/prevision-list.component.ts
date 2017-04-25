import './prevision-list.component.scss';
import template = require( './prevision-list.component.html' );
// tslint:disable
export const PrevisionListComponent: ng.IComponentOptions = {
    template: template,
    bindings: {
        previsions: '<',
        loading: '<',
        title: '@',
        onPrevisionClick: '&',
        onRefreshClick: '&'
    }
};
